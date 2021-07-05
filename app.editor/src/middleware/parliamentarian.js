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
  wipePropertyValue,
  wipePropertyStorage,
  wipeSlot,

  selectComponentProperties,
  selectComponentPropertyStorage,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentSlot,
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

let initialized = false;

function runParliamentarian(
  queueDispatch,
  state,
  pageId,
  componentId,
  updateWorkspace = true,
) {
  const siteSettings = selectSiteSettings(state);

  const languages = get(
    siteSettings,
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

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

  // STEP 1
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

  if (!!updateWorkspace) {
    queueDispatch(setVisibleProperties({ visibleProperties }));
  }

  // STEP 2
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
          queueDispatch(setComponentInstancePropertyStorage({
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
          queueDispatch(setComponentInstancePropertyValue({
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
          queueDispatch(setComponentInstancePropertyValue({
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

  // STEP 3
  // Remove values & storage from hidden properties.

  hiddenProperties.forEach((property) => {
    const propertyId = property.id;

    const hasValue = !!Object.keys(
      get(componentPropertyValues, `${propertyId}.value`, {})
    ).length;

    if (hasValue) {
      queueDispatch(wipePropertyValue({
        pageId,
        componentId,
        propertyId,
      }));
    }

    const hasStorage = !!Object.keys(
      selectComponentPropertyStorage(pageId, componentId, propertyId)(state)
    ).length;

    if (hasStorage) {
      queueDispatch(wipePropertyStorage({
        pageId,
        componentId,
        propertyId,
      }));
    }
  });

  // STEP 4
  // Validate visible property values.

  // STEP 5
  // Determine visible & hidden slots.

  const {
    visibleSlots,
    hiddenSlots,
  } = get(componentMeta, 'slots', []).reduce((acc, slot) => {
    const conditional = get(slot, 'conditional', null);

    if (!conditional) {
      return {
        ...acc,
        visibleSlots: [
          ...acc.visibleSlots,
          slot,
        ],
      };
    }

    const result = conditional({
      properties: componentPropertyValues,
      slot: parentComponentSlotMeta,
    });

    const appendTo = !!result ? 'visibleSlots' : 'hiddenSlots';

    return {
      ...acc,
      [appendTo]: [
        ...acc[appendTo],
        slot,
      ],
    };
  }, {
    visibleSlots: [],
    hiddenSlots: [],
  });

  if (!!updateWorkspace) {
    queueDispatch(setVisibleSlots({ visibleSlots }));
  }

  // STEP 6
  // Remove children from hidden slots.

  hiddenSlots.forEach((slot) => {
    const slotId = get(slot, 'id');
    const hasChildren = !!selectComponentSlot(pageId, componentId, slotId)(state).length;

    if (hasChildren) {
      queueDispatch(wipeSlot({
        pageId,
        componentId,
        slotId,
      }));
    }
  });

  // STEP 7
  // Validate visible slots.
}

const parliamentarian = store => next => action => {
  const result = next(action);

  const shouldRun = TRIGGERS.includes(action.type)
    && get(action, `payload.__parliamentarian`, false) === false;

  if (!!initialized && !shouldRun) {
    return result;
  }

  if (!initialized) {
    initialized = true;
  }

  const state = store.getState();
  const dispatches = [];
  const queueDispatch = (action) => dispatches.push(action);

  const pageId = selectActivePageId(state);
  const componentId = selectActiveComponentId(state);

  runParliamentarian(
    queueDispatch,
    state,
    pageId,
    componentId,
    true,
  );

  if (action.type === addChildComponentInstance.toString()) {
    runParliamentarian(
      queueDispatch,
      state,
      pageId,
      action.payload.componentId,
      false,
    );
  }

  batch(() => dispatches.forEach((action) => {
    store.dispatch({
      ...action,
      payload: {
        ...action.payload,
        __parliamentarian: true,
      },
    });
  }));

  console.log('parliamentarian => ', store.getState());

  return result;
}

export default parliamentarian;
