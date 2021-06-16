import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectDeviceSizeList } from '@editor/features/previewMode';

export default function Preview() {
  const { isMobilePreview } = useSelector(selectDeviceSizeList);

  const DeviceContainer = isMobilePreview ? MobileContainer : DesktopContainer;

  return (
    <SectionContainer>
      <DeviceContainer>
        <Frame src="/?simulator=true" />
      </DeviceContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const deviceContainerShared = css`
  border: 2px solid ${(props) => props.theme.colors.mono[200]};
`;

const DesktopContainer = styled.div`
  width: 100%;
  height: 66%;
  min-height: 960px;
  ${deviceContainerShared}
`;

const MobileContainer = styled.div`
  width: 375px;
  height: 667px;
  ${deviceContainerShared}
`;

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
