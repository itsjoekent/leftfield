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
  const {
    isDesktopPreview,
    isMobilePreview,
    isTabletPreview,
  } = useSelector(selectDeviceSizeList);

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
          const inheritedFrom = get(pagePreview, `components.${componentId}.properties.${propertyId}.inheritedFrom`, {});

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
