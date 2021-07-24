import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { Responsive } from 'pkg.campaign-components';
import {
  selectCompiledPage,
  selectCampaignTheme,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import {
  setActiveComponentId,
  selectActivePageId,
} from '@product/features/workspace';

const devices = {
  [Responsive.MOBILE_DEVICE]: {
    resolution: {
      width: 1080,
      height: 2340,
    },
    pixelRatio: 3,
  },
  [Responsive.TABLET_DEVICE]: {
    resolution: {
      width: 1668,
      height: 2388,
    },
    pixelRatio: 2,
  },
  [Responsive.DESKTOP_DEVICE]: {
    resolution: {
      width: 2560,
      height: 1600,
    },
    pixelRatio: 2,
  },
};

export default function Preview(props) {
  const { previewContainerDimensions } = props;

  const dispatch = useDispatch();

  const deviceSize = useSelector(selectPreviewDeviceSize);

  const pixelRatio = get(devices[deviceSize], 'pixelRatio', 0);
  const width = get(devices[deviceSize], 'resolution.width', 0) / pixelRatio;
  const height = get(devices[deviceSize], 'resolution.height', 0) / pixelRatio;

  const iframeRef = React.useRef(null);

  const activePageId = useSelector(selectActivePageId);
  const activePagePreview = useSelector(selectCompiledPage(activePageId));
  const campaignTheme = useSelector(selectCampaignTheme);

  const [isPreviewReady, setIsPreviewReady] = React.useState(false);
  const [previewTransform, setPreviewTransform] = React.useState('scale(1)');

  React.useEffect(() => {
    function onMessage(event) {
      const { data } = event;
      const { type } = data;

      if (type === 'READY') {
        setIsPreviewReady(true);
      }

      if (type === 'CLICKED') {
        const { componentId } = data;
        dispatch(setActiveComponentId({ componentId }));
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

  React.useEffect(() => {
    if (!previewContainerDimensions || !width || !height) {
      return;
    }

    const scale = Math.min(
      previewContainerDimensions[0] / width,
      previewContainerDimensions[1] / height,
    );

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const topOffset = ((previewContainerDimensions[1] - scaledHeight) / 2) + 12;
    const leftOffset = ((previewContainerDimensions[0] - scaledWidth) / 2) + 12;

    setPreviewTransform(`translate(${leftOffset}px, ${topOffset}px) scale(${scale})`);
  }, [
    width,
    height,
    previewContainerDimensions,
  ]);

  const style = { width, height, transform: previewTransform };

  return (
    <PreviewSpace>
      <DeviceContainer style={style}>
        <Frame ref={iframeRef} src={process.env.PREVIEW_PATH} />
      </DeviceContainer>
    </PreviewSpace>
  );
}

const PreviewSpace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const DeviceContainer = styled.div`
  border-radius: ${(props) => props.theme.rounded.default};
  ${(props) => props.theme.shadow.light}

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: width, height, transform;

  transform-origin: top left;
`;

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
