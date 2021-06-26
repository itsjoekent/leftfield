import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Icons } from 'pkg.admin-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMobileDevice,
  setDesktopDevice,
  selectDeviceSizeList
} from '@editor/features/previewMode';
function PreviewSelector(props) {
  const { theme } = props;
  const { isMobilePreview, isDesktopPreview } = useSelector(selectDeviceSizeList);
  const dispatch = useDispatch();

  // TODO: Refactor to IconButton ?
  return (
    <Row>
      <DeviceButton onClick={() => dispatch(setMobileDevice())}>
        <Icons.MobileLight
          width={36}
          height={36}
          color={isMobilePreview ? theme.colors.mono[900] : theme.colors.mono[400]}
        />
      </DeviceButton>
      <DeviceButton onClick={() => dispatch(setDesktopDevice())}>
        <Icons.DesktopLight
          width={36}
          height={36}
          color={isDesktopPreview ? theme.colors.mono[900] : theme.colors.mono[400]}
        />
      </DeviceButton>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: fit-content;
`;

export const DeviceButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border: none;
  box-shadow: none;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  svg path {
    transition: stroke 0.4s;
  }

  &:hover {
    svg path {
      stroke: ${props => props.theme.colors.mono[700]};
    }
  }
`;

export default withTheme(PreviewSelector);
