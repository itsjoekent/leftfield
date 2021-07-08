import React from 'react';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  Buttons,
  Icons,
  Flex,
  Typography,
  useAdminTheme,
} from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
import responsiveLabels from '@editor/constants/responsive-labels';
import {
  resetComponentInstanceStyleAttribute,
  selectComponentStyleAttributeForDeviceCascading,
} from '@editor/features/assembly';
import { selectDeviceSize } from '@editor/features/previewMode';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

const iconMap = {
  [Responsive.DESKTOP_DEVICE]: Icons.Desktop,
  [Responsive.MOBILE_DEVICE]: Icons.Mobile,
  [Responsive.TABLET_DEVICE]: Icons.Tablet,
};

export default function ResponsiveHint(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();
  const adminTheme = useAdminTheme();

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const device = useSelector(selectDeviceSize);
  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const cascadedFrom = get(attributeValue, 'cascadedFrom', null);
  const isCascading = !!cascadedFrom
    || (notResponsive && device !== Responsive.MOBILE_DEVICE);

  const canReset = !isCascading
    && !notResponsive
    && device !== Responsive.MOBILE_DEVICE;

  if (canReset) {
    return (
      <Buttons.Standard
        paddingVertical="2px"
        paddingHorizontal="4px"
        bg={(colors) => colors.mono[200]}
        borderWidth="1px"
        borderColor={(colors) => colors.mono[500]}
        hoverBorderColor={(colors) => colors.mono[700]}
        rounded={(radius) => radius.default}
        gridGap="2px"
        IconComponent={Icons.TrashLight}
        iconSize={16}
        iconColor={(colors) => colors.mono[500]}
        iconHoverColor={(colors) => colors.mono[700]}
        onClick={() => dispatch(resetComponentInstanceStyleAttribute({
          pageId: activePageId,
          componentId: activeComponentId,
          styleId,
          attributeId,
          device,
        }))}
      >
        <Typography
          fontStyle="regular"
          fontSize="12px"
          fg={(colors) => colors.mono[500]}
          hoverFg={(colors) => colors.mono[700]}
        >
          Remove {responsiveLabels[device]} override
        </Typography>
      </Buttons.Standard>
    );
  }

  const CascadingIcon = iconMap[cascadedFrom] || Icons.Mobile;

  const cascadingFromLabel = responsiveLabels[cascadedFrom]
    || responsiveLabels[Responsive.MOBILE_DEVICE];

  if (isCascading) {
    return (
      <Flex.Row align="center" gridGap="2px">
        <CascadingIcon
          width={16}
          height={16}
          color={adminTheme.colors.mono[500]}
        />
        <Typography
          fontStyle="regular"
          fontSize="12px"
          fg={(colors) => colors.mono[500]}
        >
          Inherited from {cascadingFromLabel}
        </Typography>
      </Flex.Row>
    );
  }

  return null;
}
