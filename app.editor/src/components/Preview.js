import React from 'react';
import styled, { css } from 'styled-components';
import { find, get, set } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta } from 'pkg.campaign-components';
import { selectPage } from '@editor/features/assembly';
import { selectDeviceSizeList } from '@editor/features/previewMode';
import { selectActivePageId } from '@editor/features/workspace';
import useGetSetting from '@editor/hooks/useGetSetting';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function Preview() {
  const { isMobilePreview } = useSelector(selectDeviceSizeList);
  const DeviceContainer = isMobilePreview ? MobileContainer : DesktopContainer;

  const iframeRef = React.useRef(null);

  const activePageId = useSelector(selectActivePageId);
  const activePage = useSelector(selectPage(activePageId));

  const getSetting = useGetSetting(activePageId);

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
      // @NOTE: This stringifcation is necessary because
      // the 'state' variable has `.preventExtensions()` applied.
      const pagePreview = JSON.parse(JSON.stringify(activePage));

      Object.keys(get(pagePreview, 'components', {})).forEach((componentId) => {
        const tag = get(pagePreview, `components.${componentId}.tag`);

        Object.keys(get(pagePreview, `components.${componentId}.properties`, {})).forEach((propertyId) => {
          const properties = get(ComponentMeta[tag], `properties`);
          const property = find(properties, { id: propertyId });

          const inheritFromSetting = get(property, 'inheritFromSetting', null);
          const inheritedFrom = get(pagePreview, `components.${componentId}.properties.${propertyId}.storage.inheritedFrom`, {});

          if (!!inheritFromSetting && !!inheritedFrom) {
            Object.keys(inheritedFrom).forEach((language) => {
              const valuePath = `components.${componentId}.properties.${propertyId}.value.${language}`;
              const inputValue = get(pagePreview, valuePath);

              if (typeof inputValue !== 'undefined' && inputValue !== null) {
                return;
              }

              const inheritedFromLocale = pullTranslatedValue(inheritedFrom, language);
              const settingValue = getSetting(inheritedFromLocale, inheritFromSetting);
              const translatedValue = pullTranslatedValue(settingValue, language);

              set(pagePreview, valuePath, translatedValue);
            });
          }
        });
      });

      targetWindow.postMessage({
        type: 'RENDER',
        payload: {
          page: pagePreview,
        },
      }, '*');
    }
  }, [
    activePage,
    getSetting,
    isPreviewReady,
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
