import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectPage } from '@editor/features/assembly';
import { selectDeviceSizeList } from '@editor/features/previewMode';
import { selectActivePageId } from '@editor/features/workspace';

export default function Preview() {
  const { isMobilePreview } = useSelector(selectDeviceSizeList);
  const DeviceContainer = isMobilePreview ? MobileContainer : DesktopContainer;

  const iframeRef = React.useRef(null);

  const activePageId = useSelector(selectActivePageId);
  const activePage = useSelector(selectPage(activePageId));

  const [isPreviewReady, setIsPreviewReady] = React.useState(false);

  React.useEffect(() => {
    function onMessage(event) {
      if (event.data.type === 'READY') {
        setIsPreviewReady(true);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const { contentWindow: targetWindow } = iframe;

    if (isPreviewReady && !!activePage) {
      targetWindow.postMessage({
        type: 'RENDER',
        payload: {
          page: activePage,
        },
      }, '*');
    }
  }, [
    isPreviewReady,
    activePage,
  ]);

  return (
    <SectionContainer>
      <DeviceContainer>
        <Frame ref={iframeRef} src="http://localhost:5001/" />
      </DeviceContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  display: flex;
  align-items: flex-start;
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
