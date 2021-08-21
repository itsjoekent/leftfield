import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Responsive } from 'pkg.campaign-components';

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
  const {
    deviceSize,
    iframeRef,
    iframeSrc,
    containerDimensions,
  } = props;

  const pixelRatio = get(devices[deviceSize], 'pixelRatio', 0);
  const width = get(devices[deviceSize], 'resolution.width', 0) / pixelRatio;
  const height = get(devices[deviceSize], 'resolution.height', 0) / pixelRatio;

  const [previewTransform, setPreviewTransform] = React.useState('scale(1)');

  React.useEffect(() => {
    if (!containerDimensions || !width || !height) {
      return;
    }

    const scale = Math.min(
      containerDimensions[0] / width,
      containerDimensions[1] / height,
    );

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const topOffset = ((containerDimensions[1] - scaledHeight) / 2) + 12;
    const leftOffset = ((containerDimensions[0] - scaledWidth) / 2) + 12;

    setPreviewTransform(`translate(${leftOffset}px, ${topOffset}px) scale(${scale})`);
  }, [
    width,
    height,
    containerDimensions,
  ]);

  const style = { width, height, transform: previewTransform };

  return (
    <PreviewSpace>
      <DeviceContainer style={style}>
        <Frame ref={iframeRef} src={iframeSrc} />
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
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.colors.mono[200]};
  border-radius: ${(props) => props.theme.rounded.extra};
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
