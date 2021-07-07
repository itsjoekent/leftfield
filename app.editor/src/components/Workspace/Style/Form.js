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
import WorkspaceStyleAttribute from '@editor/components/Workspace/Style/Attribute';
import WorkspaceStyleLabel from '@editor/components/Workspace/Style/Label';
import {
  setDesktopDevice,
  setMobileDevice,
  setTabletDevice,
  selectDeviceSizeList,
} from '@editor/features/previewMode';

export default function StyleForm(props) {
  const { styleData } = props;

  const styleId = get(styleData, 'id');
  const label = get(styleData, 'label', '');
  const attributes = get(styleData, 'attributes', []);

  const dispatch = useDispatch();

  const {
    isDesktopPreview,
    isMobilePreview,
    isTabletPreview,
  } = useSelector(selectDeviceSizeList);

  return (
    <Flex.Column
      padding="6px"
      gridGap="16px"
      bg={(colors) => colors.mono[200]}
      rounded={(radius) => radius.default}
    >
      <Flex.Column gridGap="12px">
        <Flex.Row align="center" justify="space-between">
          <Flex.Row align="center" gridGap="6px">
            <Typography
              fontStyle="bold"
              fontSize="16px"
              fg={(colors) => colors.mono[700]}
            >
              {label}
            </Typography>
            <Tooltip copy="Open theme editor" point={Tooltip.UP_LEFT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.FileFill}
                width={20}
                height={20}
                color={(colors) => colors.mono[700]}
                hoverColor={(colors) => colors.blue[500]}
                aria-label="Open theme editor"
                onClick={() => {}}
              />
            </Tooltip>
          </Flex.Row>
          <Flex.Row align="center" gridGap="6px">
            <Tooltip copy="Mobile preview" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Mobile}
                color={(colors) => isMobilePreview ? colors.mono[900] : colors.mono[400]}
                hoverColor={(colors) => colors.mono[700]}
                aria-label="Switch to mobile preview"
                onClick={() => dispatch(setMobileDevice())}
              />
            </Tooltip>
            <Tooltip copy="Tablet preview" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Tablet}
                color={(colors) => isTabletPreview ? colors.mono[900] : colors.mono[400]}
                hoverColor={(colors) => colors.mono[700]}
                aria-label="Switch to tablet preview"
                onClick={() => dispatch(setTabletDevice())}
              />
            </Tooltip>
            <Tooltip copy="Desktop preview" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Desktop}
                color={(colors) => isDesktopPreview ? colors.mono[900] : colors.mono[400]}
                hoverColor={(colors) => colors.mono[700]}
                aria-label="Switch to desktop preview"
                onClick={() => dispatch(setDesktopDevice())}
              />
            </Tooltip>
          </Flex.Row>
        </Flex.Row>
        {/* TODO: help text */}
      </Flex.Column>
      <Flex.Column gridGap="24px">
        {attributes.map((attribute) => (
          <Flex.Column key={get(attribute, 'id')} gridGap="6px">
            <WorkspaceStyleLabel
              styleId={styleId}
              attribute={attribute}
            />
            <WorkspaceStyleAttribute
              styleId={styleId}
              attribute={attribute}
            />
          </Flex.Column>
        ))}
      </Flex.Column>
    </Flex.Column>
  );
}
