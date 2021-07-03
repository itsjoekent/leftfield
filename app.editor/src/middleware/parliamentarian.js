import { batch } from 'react-redux';
import { find, get, set } from 'lodash';
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
  buildComponent,
  reorderChildComponentInstance,
  removeChildComponentInstance,
  setComponentInstancePropertyValue,
  setComponentInstancePropertyStorage,

  selectComponentProperties,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectPageSettings,
  selectPageTemplateId,
  selectSiteSettings,
} from '@editor/features/assembly';
import {
  setActiveComponentId,
  setActivePageId,
  setVisibleProperties,
  setVisibleSlots,

  selectActivePageId,
  selectActiveComponentId,
} from '@editor/features/workspace';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

const TRIGGERS = [
  addChildComponentInstance.toString(),
  buildComponent.toString(),
  reorderChildComponentInstance.toString(),
  removeChildComponentInstance.toString(),
  setComponentInstancePropertyValue.toString(),
  setComponentInstancePropertyStorage.toString(),
  setActiveComponentId.toString(),
  setActivePageId.toString(),
];

const parliamentarian = store => next => action => {
  const result = next(action);

  if (
    !TRIGGERS.includes(action.type)
    || !!get(action, `payload.__parliamentarian`, false)
  ) {
    return result;
  }

  const state = store.getState();
  const dispatches = [];

  const siteSettings = selectSiteSettings(state);

  const languages = get(
    siteSettings,
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  const pageId = selectActivePageId(state);
  const componentId = selectActiveComponentId(state);
  const componentTag = selectComponentTag(pageId, componentId)(state);
  const componentPropertyValues = selectComponentProperties(pageId, componentId)(state);

  const componentMeta = ComponentMeta[componentTag];
  const componentProperties = get(componentMeta, 'properties', []);

  const parentComponentId = selectComponentsParentComponentId(pageId, componentId)(state);
  const parentComponentTag = selectComponentTag(pageId, parentComponentId)(state);
  const parentComponentSlotId = selectComponentsParentComponentSlotId(pageId, componentId)(state);
  const parentComponentSlotMeta = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

  const templateSettings = selectPageSettings(selectPageTemplateId(pageId)(state))(state);
  const pageSettings = selectPageSettings(pageId)(state);

  // STEP 1.
  // Determine visible & hidden properties.

  const {
    visibleProperties,
    hiddenProperties,
  } = componentProperties.reduce((acc, property) => {
    const conditional = get(property, 'conditional', null);

    if (!conditional) {
      return {
        ...acc,
        visibleProperties: [
          ...acc.visibleProperties,
          property,
        ],
      };
    }

    const result = conditional({
      properties: componentPropertyValues,
      slot: parentComponentSlotMeta,
    });

    const appendTo = !!result ? 'visibleProperties' : 'hiddenProperties';

    return {
      ...acc,
      [appendTo]: [
        ...acc[appendTo],
        property,
      ],
    };
  }, {
    visibleProperties: [],
    hiddenProperties: [],
  });

  dispatches.push(setVisibleProperties({ visibleProperties }));

  // STEP 2.
  // Set default values for all visible properties.

  const appliedDefaults = {};

  visibleProperties.forEach((property) => {
    const propertyId = property.id;

    const defaultValue = get(property, 'defaultValue', null);
    const dynamicDefaultValue = get(property, 'dynamicDefaultValue', null);
    const inheritFromSetting = get(property, 'inheritFromSetting', null);

    const getPropertyValue = (language) => get(componentPropertyValues, `${propertyId}.value.${language}`);
    const getStorageValue = (storageKey, language) => get(componentPropertyValues, `${propertyId}.storage.${storageKey}.${language}`);
    const hasSetDefault = (language) => !!get(appliedDefaults, `${propertyId}.${language}`, false)
      || !!(inheritFromSetting && isDefined(getStorageValue('inheritedFrom', language)))
      || isDefined(getPropertyValue(language));

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

      languages.forEach((language) => {
        const inheritanceLevel = get(settingMatch(language), '[1]', null);

        if (!!inheritanceLevel && !hasSetDefault(language)) {
          dispatches.push(setComponentInstancePropertyStorage({
            pageId,
            componentId,
            propertyId: property.id,
            key: 'inheritedFrom',
            value: inheritanceLevel,
            language,
          }));

          set(appliedDefaults, `${propertyId}.${language}`, true);
        }
      });
    }

    if (dynamicDefaultValue) {
      const dynamicValue = dynamicDefaultValue({
        properties: componentPropertyValues,
        slot: parentComponentSlotMeta,
      });

      Object.keys(dynamicValue).forEach((language) => {
        if (hasSetDefault(language)) {
          return;
        }

        const translatedValue = pullTranslatedValue(dynamicValue, language);

        if (getPropertyValue(language) !== translatedValue) {
          dispatches.push(setComponentInstancePropertyValue({
            pageId,
            componentId,
            propertyId,
            value: translatedValue,
            language,
          }));

          set(appliedDefaults, `${propertyId}.${language}`, true);
        }
      });

      return;
    }

    if (defaultValue !== null) {
      Object.keys(defaultValue).forEach((language) => {
        if (hasSetDefault(language)) {
          return;
        }

        const translatedValue = pullTranslatedValue(defaultValue, language);

        if (getPropertyValue(language) !== translatedValue) {
          dispatches.push(setComponentInstancePropertyValue({
            pageId,
            componentId,
            propertyId,
            value: translatedValue,
            language,
          }));
        }
      });
    }
  });

  batch(() => dispatches.forEach((action) => {
    store.dispatch({
      ...action,
      payload: {
        ...action.payload,
        __parliamentarian: true,
      },
    });
  }));

  console.log({
    visibleProperties,
    hiddenProperties,
    state: store.getState(),
  });

  // determine what properties, slots, to show to UI, compute all dynamic* keys
  // set default property values & setting links
  // remove property values & setting links from properties no longer available
  // remove children from slots no longer available
  // validate all property values, slots

  return result;
}

export default parliamentarian;
