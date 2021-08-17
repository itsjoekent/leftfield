import { find, get, set } from 'lodash';
import {
  ComponentMeta,
  Languages,
  Settings,
} from 'pkg.campaign-components';
import { getPropertyValue } from '@product/hooks/useGetPropertyValue';
import {
  selectComponentProperties,
  selectComponentPropertyValue,
  selectComponentStyles,
  selectComponentStyleInheritsFrom,
  selectComponentTag,
  selectPageSettings,
  selectSiteSettings,
  selectStyleAttributesFromPreset,
} from '@product/features/assembly';
import isDefined from '@product/utils/isDefined';

export default function compileAssembly(state, route) {
  const languages = get(
    siteSettings,
    `${Settings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  const pageSettings = selectPageSettings(route)(state);
  const siteSettings = selectSiteSettings(state);

  const pageCompilation = JSON.parse(JSON.stringify(get(state, `assembly.pages.${route}`)));

  Object.keys(siteSettings || {}).forEach((settingId) => {
    Object.keys(get(siteSettings, settingId, {})).forEach((language) => {
      if (!isDefined(get(pageSettings, `${settingId}.${language}`, null))) {
        set(
          pageCompilation,
          `settings.${settingId}.${language}`,
          get(siteSettings, `${settingId}.${language}`, null),
        );
      }
    });
  });

  Object.keys(get(pageCompilation, 'components', {})).forEach((componentId) => {
    const tag = selectComponentTag(route, componentId)(state);
    const previewComponentProperties = selectComponentProperties(route, componentId)(state);
    const previewComponentStyles = selectComponentStyles(route, componentId)(state);

    Object.keys(previewComponentProperties).forEach((propertyId) => {
      const properties = get(ComponentMeta[tag], `properties`);
      const property = find(properties, { id: propertyId });
      const isTranslatable = get(property, 'isTranslatable', false);

      languages.forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        if (isDefined(selectComponentPropertyValue(route, componentId, propertyId, language)(state))) {
          return;
        }

        set(
          pageCompilation,
          `components.${componentId}.properties.${propertyId}.value.${language}`,
          getPropertyValue(
            propertyId,
            language,
            pageSettings,
            siteSettings,
            tag,
            previewComponentProperties,
          ),
        );

        delete pageCompilation.components[componentId].properties[propertyId].inheritedFrom;
      });
    });

    Object.keys(previewComponentStyles).forEach((styleId) => {
      const inheritsFromPreset = selectComponentStyleInheritsFrom(
        route,
        componentId,
        styleId,
      )(state);

      if (isDefined(inheritsFromPreset)) {
        set(
          pageCompilation,
          `components.${componentId}.styles.${styleId}`,
          selectStyleAttributesFromPreset(inheritsFromPreset)(state),
        );
      }
    });
  });

  return pageCompilation;
}
