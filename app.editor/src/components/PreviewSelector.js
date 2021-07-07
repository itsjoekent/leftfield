import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Buttons,
  Icons,
  Flex,
  Tooltip,
} from 'pkg.admin-components';
import {
  setDesktopDevice,
  setMobileDevice,
  setTabletDevice,
  selectDeviceSizeList,
} from '@editor/features/previewMode';

function PreviewSelector(props) {
  const {
    isDesktopPreview,
    isMobilePreview,
    isTabletPreview,
  } = useSelector(selectDeviceSizeList);

  const dispatch = useDispatch();

  return (
    <Flex.Row align="center" gridGap="12px">
      <Tooltip copy="Mobile preview" point={Tooltip.UP}>
        <Buttons.IconButton
          IconComponent={Icons.Mobile}
          color={(colors) => isMobilePreview ? colors.mono[900] : colors.mono[400]}
          hoverColor={(colors) => colors.blue[500]}
          aria-label="Switch to mobile preview"
          onClick={() => dispatch(setMobileDevice())}
        />
      </Tooltip>
      <Tooltip copy="Tablet preview" point={Tooltip.UP}>
        <Buttons.IconButton
          IconComponent={Icons.Tablet}
          color={(colors) => isTabletPreview ? colors.mono[900] : colors.mono[400]}
          hoverColor={(colors) => colors.blue[500]}
          aria-label="Switch to tablet preview"
          onClick={() => dispatch(setTabletDevice())}
        />
      </Tooltip>
      <Tooltip copy="Desktop preview" point={Tooltip.UP}>
        <Buttons.IconButton
          IconComponent={Icons.Desktop}
          color={(colors) => isDesktopPreview ? colors.mono[900] : colors.mono[400]}
          hoverColor={(colors) => colors.blue[500]}
          aria-label="Switch to desktop preview"
          onClick={() => dispatch(setDesktopDevice())}
        />
      </Tooltip>
    </Flex.Row>
  );
}

export default PreviewSelector;
