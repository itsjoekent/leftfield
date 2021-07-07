import React from 'react';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  Buttons,
  Icons,
  Flex,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
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

const labelMap = {
  [Responsive.DESKTOP_DEVICE]: 'desktop styles',
  [Responsive.MOBILE_DEVICE]: 'mobile styles',
  [Responsive.TABLET_DEVICE]: 'tablet styles',
};

export default function Label(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();

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

  const CascadingIcon = iconMap[cascadedFrom] || Icons.Mobile;
  const cascadingLabel = labelMap[cascadedFrom] || labelMap[Responsive.MOBILE_DEVICE];

  const canReset = !isCascading
    && !notResponsive
    && device !== Responsive.MOBILE_DEVICE;

  return (
    <Flex.Column gridGap="2px">
      <Flex.Row align="center" gridGap="4px">
        <Typography
          id={`${styleId}-${attribute.id}`}
          as="label"
          fontStyle="medium"
          fontSize="16px"
          fg={(colors) => colors.mono[900]}
        >
          {get(attribute, 'label', '')}
        </Typography>
        {isCascading && (
          <Tooltip
            copy={`Inherited from ${cascadingLabel}`}
            point={Tooltip.UP_LEFT_ALIGNED}
          >
            <Flex.Column align="center" justify="center">
              <CascadingIcon
                width={16}
                height={16}
                color={"black"}
              />
            </Flex.Column>
          </Tooltip>
        )}
        {canReset && (
          <Tooltip copy="Reset value" point={Tooltip.UP_LEFT_ALIGNED}>
            <Buttons.IconButton
              IconComponent={Icons.Refresh2}
              width={20}
              height={20}
              color={(colors) => colors.mono[500]}
              hoverColor={(colors) => colors.blue[700]}
              aria-label="Reset value"
              onClick={() => dispatch(resetComponentInstanceStyleAttribute({
                pageId: activePageId,
                componentId: activeComponentId,
                styleId,
                attributeId,
                device: targetDevice,
              }))}
            />
          </Tooltip>
        )}
      </Flex.Row>
      {/* TODO: help text */}
    </Flex.Column>
  );
}
