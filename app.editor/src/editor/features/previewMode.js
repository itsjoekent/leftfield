import { createSlice } from '@reduxjs/toolkit';

export const MOBILE_DEVICE = 'MOBILE_DEVICE';
export const DESKTOP_DEVICE = 'DESKTOP_DEVICE';

export const previewModeSlide = createSlice({
  name: 'previewMode',
  initialState: {
    deviceSize: DESKTOP_DEVICE,
  },
  reducers: {
    setMobileDevice: (state) => {
      state.deviceSize = MOBILE_DEVICE;
    },
    setDesktopDevice: (state) => {
      state.deviceSize = DESKTOP_DEVICE;
    },
  },
});

export function selectDeviceSize(state) {
  return state.previewMode.deviceSize;
}

export function selectIsMobileDeviceSize(state) {
  return selectDeviceSize(state) === MOBILE_DEVICE;
}

export function selectIsDesktopDeviceSize(state) {
  return selectDeviceSize(state) === DESKTOP_DEVICE;
}

export function selectDeviceSizeList(state) {
  return {
    isMobilePreview: selectIsMobileDeviceSize(state),
    isDesktopPreview: selectIsDesktopDeviceSize(state),
  };
}

export const { setMobileDevice, setDesktopDevice } = previewModeSlide.actions;

export default previewModeSlide.reducer;
