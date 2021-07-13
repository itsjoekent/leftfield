import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { ComponentMeta, Languages } from 'pkg.campaign-components';
import {
  MAIN_COMPONENT,
  PAGE_SETTINGS,
  SITE_SETTINGS,
} from '@editor/constants/inheritance';
import {
  selectComponentInstanceOf,
  selectComponentProperties,
  selectComponentTag,
  selectLibraryComponentProperties,
  selectPageSettings,
  selectSiteSettings,
} from '@editor/features/assembly';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export function getPropertyValue(
  propertyId,
  language = Languages.US_ENGLISH_LANG,
  _pageSettings,
  _siteSettings,
  _componentTag,
  _componentProperties,
  _instanceOf,
  _instanceOfProperties,
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

  const componentProperty = get(_componentProperties, propertyId);
  const componentPropertyMeta = find(get(ComponentMeta[_componentTag], 'properties'), { id: propertyId });
  const inheritFromSetting = get(componentPropertyMeta, 'inheritFromSetting', null);
  const inheritedFrom = pullTranslatedValue(get(componentProperty, 'inheritedFrom', null), language);

  if (isDefined(_instanceOf) && inheritedFrom === MAIN_COMPONENT) {
    const instanceOfProperty = get(_instanceOfProperties, propertyId);
    const instanceOfInheritedFrom = pullTranslatedValue(get(instanceOfProperty, 'inheritedFrom', null), language);

    if (isDefined(inheritFromSetting) && isDefined(instanceOfInheritedFrom)) {
      return pullTranslatedValue(
        get(search(instanceOfInheritedFrom), inheritFromSetting, null),
        language,
      );
    }

    const instanceOfPropertyValue = pullTranslatedValue(
      get(instanceOfProperty, 'value', null),
      language,
    );

    if (isDefined(instanceOfPropertyValue)) {
      return instanceOfPropertyValue;
    }
  }

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

export default function useGetPropertyValue(pageId, componentId) {
  const pageSettings = useSelector(selectPageSettings(pageId));
  const siteSettings = useSelector(selectSiteSettings);

  const componentTag = useSelector(selectComponentTag(pageId, componentId));
  const componentProperties = useSelector(selectComponentProperties(pageId, componentId));

  const instanceOf = useSelector(selectComponentInstanceOf(pageId, componentId));
  const instanceOfProperties = useSelector(selectLibraryComponentProperties(instanceOf));

  return (propertyId, language) => getPropertyValue(
    propertyId,
    language,
    pageSettings,
    siteSettings,
    componentTag,
    componentProperties,
    instanceOf,
    instanceOfProperties,
  );
}
