import { createSlice } from '@reduxjs/toolkit';
import { Responsive } from 'pkg.campaign-components';

export const previewModeSlice = createSlice({
  name: 'previewMode',
  initialState: {
    deviceSize: Responsive.DESKTOP_DEVICE,
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

export function selectDeviceSize(state) {
  return state.previewMode.deviceSize;
}

export function selectIsDesktopDeviceSize(state) {
  return selectDeviceSize(state) === Responsive.DESKTOP_DEVICE;
}

export function selectIsMobileDeviceSize(state) {
  return selectDeviceSize(state) === Responsive.MOBILE_DEVICE;
}

export function selectIsTabletDevice(state) {
  return selectDeviceSize(state) === Responsive.TABLET_DEVICE;
}

export function selectDeviceSizeList(state) {
  return {
    isDesktopPreview: selectIsDesktopDeviceSize(state),
    isMobilePreview: selectIsMobileDeviceSize(state),
    isTabletPreview: selectIsTabletDevice(state),
  };
}
