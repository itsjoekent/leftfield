import { get } from 'lodash';
import {
  ComponentMeta,
  Languages,
  SiteSettings,
} from 'pkg.campaign-components';
import {
  SITE_SETTINGS,
  TEMPLATE_SETTINGS,
  PAGE_SETTINGS,
} from '@editor/constants/inheritance';
import {
  addChildComponentInstance,
  selectComponentTag,
  selectPageSettings,
  selectPageTemplateId,
  selectSiteSettings,
  setComponentInstancePropertyValue,
  setComponentInstancePropertyStorage,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
} from '@editor/features/assembly';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

const componentDefaults = store => next => action => {
  if (action.type !== addChildComponentInstance.toString()) {
    return next(action);
  }

  const result = next(action);
  const state = store.getState();

  const siteSettings = selectSiteSettings(state);
  const languages = get(siteSettings, SiteSettings.LANGUAGES.key, [Languages.US_ENGLISH_LANG]);

  const {
    payload: {
      pageId,
      componentId,
    },
  } = action;

  const templateSettings = selectPageSettings(selectPageTemplateId(pageId)(state))(state);
  const pageSettings = selectPageSettings(pageId)(state);

  const componentTag = selectComponentTag(pageId, componentId)(state);
  const propertyMeta = get(ComponentMeta[componentTag], 'properties', []);

  propertyMeta.forEach((property) => {
    const propertyId = property.id;
    const defaultValue = get(property, 'defaultValue', null);
    const dynamicDefaultValue = get(property, 'dynamicDefaultValue', null);
    const isTranslatable = get(property, 'isTranslatable', false);
    const inheritFromSetting = get(property, 'inheritFromSetting', null);

    if (!!inheritFromSetting) {
      const search = [
        [pageSettings, PAGE_SETTINGS],
        [templateSettings, TEMPLATE_SETTINGS],
        [siteSettings, SITE_SETTINGS],
      ];

      const settingMatch = (language) => search.find((item) => {
        const [settings] = item;
        const settingValue = get(settings, inheritFromSetting, null);

        if (language) {
          return pullTranslatedValue(settingValue, language) !== null;
        }

        return settingValue !== null;
      });

      if (!!settingMatch) {
        if (isTranslatable) {
          languages.forEach((language) => {
            const inheritanceLevel = settingMatch(language);

            if (!!inheritanceLevel) {
              store.dispatch(setComponentInstancePropertyStorage({
                pageId,
                componentId,
                propertyId: property.id,
                key: 'inheritedFrom',
                value: inheritanceLevel[1],
                language,
              }));
            }
          });
        } else {
          const inheritanceLevel = settingMatch();

          if (!!inheritanceLevel) {
            store.dispatch(setComponentInstancePropertyStorage({
              pageId,
              componentId,
              propertyId: property.id,
              key: 'inheritedFrom',
              value: inheritanceLevel[1],
            }));
          }
        }

        return;
      }
    }

    if (dynamicDefaultValue) {
      const parentComponentId = selectComponentsParentComponentId(pageId, componentId)(state);
      const parentComponentTag = selectComponentTag(pageId, parentComponentId)(state);
      const parentComponentSlotId = selectComponentsParentComponentSlotId(pageId, parentComponentId)(state);

      const slot = get(ComponentMeta[parentComponentTag], `slots.${parentComponentSlotId}`, null);

      store.dispatch(setComponentInstancePropertyValue({
        pageId,
        componentId,
        propertyId,
        value: dynamicDefaultValue({ slot }),
      }));

      return;
    }

    if (defaultValue !== null) {
      store.dispatch(setComponentInstancePropertyValue({
        pageId,
        componentId,
        propertyId,
        value: defaultValue,
      }));
    }
  });

  console.log(store.getState())

  return result;
}

export default componentDefaults;
