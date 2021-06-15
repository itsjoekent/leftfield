import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMobileDevice,
  setDesktopDevice,
  selectDeviceSizeList
} from '@editor/features/previewMode';

export default function Preview() {
  const { isMobilePreview, isDesktopPreview } = useSelector(selectDeviceSizeList);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{`isMobilePreview:${isMobilePreview} :: isDesktopPreview:${isDesktopPreview}`}</p>
      <button onClick={() => dispatch(setMobileDevice())}>
        mobile
      </button>
      <button onClick={() => dispatch(setDesktopDevice())}>
        desktop
      </button>
    </div>
  );
}
