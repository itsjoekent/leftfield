import React from 'react';
import { useDispatch } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import Preview from '@product/components/Preview';
import {
  selectCompiledPage,
  selectCampaignTheme,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import {
  setActiveComponentId,
  selectActivePageRoute,
} from '@product/features/workspace';

export default function WorkspacePreview(props) {
  const { containerDimensions } = props;

  const dispatch = useDispatch();

  const deviceSize = useSelector(selectPreviewDeviceSize);

  const iframeRef = React.useRef(null);

  const activePageRoute = useSelector(selectActivePageRoute);
  const activePagePreview = useSelector(selectCompiledPage(activePageRoute));
  const campaignTheme = useSelector(selectCampaignTheme);

  const [isPreviewReady, setIsPreviewReady] = React.useState(false);

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

  return (
    <Preview
      deviceSize={deviceSize}
      iframeRef={iframeRef}
      iframeSrc={process.env.PREVIEW_PATH}
      containerDimensions={containerDimensions}
    />
  );
}
