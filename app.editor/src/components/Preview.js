import React from 'react';
import styled, { css } from 'styled-components';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import {
  selectCompiledPage,
  selectCampaignTheme,
} from '@editor/features/assembly';
import { selectDeviceSizeList } from '@editor/features/previewMode';
import { selectActivePageId } from '@editor/features/workspace';

export default function Preview() {
  const {
    isDesktopPreview,
    isMobilePreview,
    isTabletPreview,
  } = useSelector(selectDeviceSizeList);

  const iframeRef = React.useRef(null);

  const activePageId = useSelector(selectActivePageId);
  const activePagePreview = useSelector(selectCompiledPage(activePageId));
  const campaignTheme = useSelector(selectCampaignTheme);

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

    if (isPreviewReady && !isEmpty(activePagePreview)) {
      targetWindow.postMessage({
        type: 'RENDER',
        payload: {
          page: activePagePreview,
          campaignTheme,
        },
      }, '*');
    }
  }, [
    isPreviewReady,
    activePagePreview,
    campaignTheme,
  ]);

  return (
    <SectionContainer>
      <DeviceContainer
        isDesktopPreview={isDesktopPreview}
        isMobilePreview={isMobilePreview}
        isTabletPreview={isTabletPreview}
      >
        <Frame ref={iframeRef} src="http://localhost:5001/" />
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

const DeviceContainer = styled.div`
  border-radius: ${(props) => props.theme.rounded.default};
  ${(props) => props.theme.shadow.light}

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: width, height;

  ${(props) => props.isMobilePreview && css`
    width: 375px;
    height: 667px;
  `}

  ${(props) => props.isDesktopPreview && css`
    width: 100%;
    height: 66%;
    min-height: 960px;
  `}

  ${(props) => props.isTabletPreview && css`
    width: 100%;
    height: 100%;
    max-width: 768px;
    max-height: 1024px;
  `}
`;

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
