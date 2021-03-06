import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta, Languages } from 'pkg.campaign-components';
import {
  PAGE_SETTINGS,
  SITE_SETTINGS,
} from '@product/constants/inheritance';
import {
  selectComponentProperties,
  selectComponentTag,
  selectPageSettings,
  selectSiteSettings,
} from '@product/features/assembly';
import isDefined from '@product/utils/isDefined';
import pullTranslatedValue from '@product/utils/pullTranslatedValue';

export function getPropertyValue(
  propertyId,
  language = Languages.US_ENGLISH_LANG,
  _pageSettings,
  _siteSettings,
  _componentTag,
  _componentProperties,
) {
  const search = ((searchFrom) => {
    switch (searchFrom) {
      case SITE_SETTINGS:
        return _siteSettings;
      case PAGE_SETTINGS:
        return _pageSettings;
      default:
        return null;
    }
  });

  const componentPropertyMeta = find(get(ComponentMeta[_componentTag], 'properties'), { id: propertyId });
  const inheritFromSetting = get(componentPropertyMeta, 'inheritFromSetting', null);

  const componentProperty = get(_componentProperties, propertyId);
  const inheritedFrom = pullTranslatedValue(get(componentProperty, 'inheritedFrom', null), language);

  if (isDefined(inheritFromSetting) && isDefined(inheritedFrom)) {
    return pullTranslatedValue(
      get(search(inheritedFrom), inheritFromSetting, null),
      language,
    );
  }

  const propertyValue = pullTranslatedValue(
    get(componentProperty, 'value', null),
    language,
  );

  return propertyValue;
}

export default function useGetPropertyValue(route, componentId) {
  const pageSettings = useSelector(selectPageSettings(route));
  const siteSettings = useSelector(selectSiteSettings);

  const componentTag = useSelector(selectComponentTag(route, componentId));
  const componentProperties = useSelector(selectComponentProperties(route, componentId));

  return (propertyId, language) => getPropertyValue(
    propertyId,
    language,
    pageSettings,
    siteSettings,
    componentTag,
    componentProperties,
  );
}
