import { createSlice } from '@reduxjs/toolkit';
import { Responsive } from 'pkg.campaign-components';

export const previewModeSlice = createSlice({
  name: 'previewMode',
  initialState: {
    deviceSize: Responsive.MOBILE_DEVICE,
  },
  reducers: {
    setDesktopDevice: (state) => {
      state.deviceSize = Responsive.DESKTOP_DEVICE;
    },
    setMobileDevice: (state) => {
      state.deviceSize = Responsive.MOBILE_DEVICE;
    },
    setTabletDevice: (state) => {
      state.deviceSize = Responsive.TABLET_DEVICE;
    },
  },
});

export const {
  setDesktopDevice,
  setMobileDevice,
  setTabletDevice,
} = previewModeSlice.actions;

export default previewModeSlice.reducer;

export function selectPreviewDeviceSize(state) {
  return state.previewMode.deviceSize;
}

export function selectPreviewIsDesktopDeviceSize(state) {
  return selectPreviewDeviceSize(state) === Responsive.DESKTOP_DEVICE;
}

export function selectPreviewIsMobileDeviceSize(state) {
  return selectPreviewDeviceSize(state) === Responsive.MOBILE_DEVICE;
}

export function selectPreviewIsTabletDevice(state) {
  return selectPreviewDeviceSize(state) === Responsive.TABLET_DEVICE;
}

export function selectPreviewDeviceSizeList(state) {
  return {
    isDesktopPreview: selectPreviewIsDesktopDeviceSize(state),
    isMobilePreview: selectPreviewIsMobileDeviceSize(state),
    isTabletPreview: selectPreviewIsTabletDevice(state),
  };
}
