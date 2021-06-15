import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMobileDevice,
  setDesktopDevice,
  selectDeviceSizeList
} from '@editor/features/previewMode';

export default function PreviewSelector() {
  const { isMobilePreview, isDesktopPreview } = useSelector(selectDeviceSizeList);
  const dispatch = useDispatch();

  return (
    <Row>
      <button onClick={() => dispatch(setMobileDevice())}>
        mobile
      </button>
      <button onClick={() => dispatch(setDesktopDevice())}>
        desktop
      </button>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;
