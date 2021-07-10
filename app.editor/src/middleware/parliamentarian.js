import { batch } from 'react-redux';
import { find, get, set } from 'lodash';
import {
  ComponentMeta,
  Languages,
  Responsive,
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
  setComponentInstanceInheritedFrom,
  setComponentInstanceStyle,
  setComponentInstanceCustomStyle,
  setComponentInstanceThemeStyle,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,

  selectComponentProperties,
  selectComponentPropertyInheritedFrom,
  selectComponentPropertyInheritedFromForLanguage,
  selectComponentStyles,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentSlot,
  selectPageSettings,
  selectPageTemplateId,
  selectSiteSettings,
  selectCampaignTheme,
} from '@editor/features/assembly';
import {
  setActiveComponentId,
  setActivePageId,
  setVisibleProperties,
  setVisibleSlots,
  setVisibleStyles,

  navigateToPastComponent,
  navigateToFutureComponent,

  selectActivePageId,
  selectActiveComponentId,
} from '@editor/features/workspace';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export const PARLIAMENTARIAN_ESCAPE_KEY = '__parliamentarian';

const TRIGGERS = [
  addChildComponentInstance.toString(),
  buildComponent.toString(),
  reorderChildComponentInstance.toString(),
  removeChildComponentInstance.toString(),
  setComponentInstancePropertyValue.toString(),
  setComponentInstanceInheritedFrom.toString(),
  setComponentInstanceCustomStyle.toString(),
  setComponentInstanceThemeStyle.toString(),
  setActiveComponentId.toString(),
  navigateToPastComponent.toString(),
  navigateToFutureComponent.toString(),
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
  const campaignTheme = selectCampaignTheme(state);

  const languages = get(
    siteSettings,
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  const componentTag = selectComponentTag(pageId, componentId)(state);
  const componentPropertyValues = selectComponentProperties(pageId, componentId)(state);
  const componentStyleValues = selectComponentStyles(pageId, componentId)(state);

  const componentMeta = ComponentMeta[componentTag];
  const componentProperties = get(componentMeta, 'properties', []);

  const parentComponentId = selectComponentsParentComponentId(pageId, componentId)(state);
  const parentComponentTag = selectComponentTag(pageId, parentComponentId)(state);
  const parentComponentSlotId = selectComponentsParentComponentSlotId(pageId, componentId)(state);
  const parentComponentSlotMeta = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

  const templateSettings = selectPageSettings(selectPageTemplateId(pageId)(state))(state);
  const pageSettings = selectPageSettings(pageId)(state);

  // @NOTE
  // Step: Determine visible & hidden properties.

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

  // @NOTE
  // Step: Set default values for all visible properties.

  const appliedPropertyDefaults = {};

  visibleProperties.forEach((property) => {
    const propertyId = property.id;

    const defaultValue = get(property, 'defaultValue', null);
    const dynamicDefaultValue = get(property, 'dynamicDefaultValue', null);
    const inheritFromSetting = get(property, 'inheritFromSetting', null);

    const getPropertyValue = (language) => get(componentPropertyValues, `${propertyId}.value.${language}`);

    const hasSetDefault = (language) => !!get(appliedPropertyDefaults, `${propertyId}.${language}`, false)
      || !!(inheritFromSetting && isDefined(
        selectComponentPropertyInheritedFromForLanguage(
          pageId,
          componentId,
          propertyId,
          language,
        )(state)))
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
          queueDispatch(setComponentInstanceInheritedFrom({
            pageId,
            componentId,
            propertyId: property.id,
            value: inheritanceLevel,
            language,
          }));

          set(appliedPropertyDefaults, `${propertyId}.${language}`, true);
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

          set(appliedPropertyDefaults, `${propertyId}.${language}`, true);
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

  // @NOTE
  // Step: Remove values from hidden properties.

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

    const hasInheritedFrom = !!Object.keys(
      selectComponentPropertyInheritedFrom(pageId, componentId, propertyId)(state)
    ).length;

    if (hasInheritedFrom) {
      queueDispatch(wipePropertyInheritedFrom({
        pageId,
        componentId,
        propertyId,
      }));
    }
  });

  // @NOTE
  // Step: Validate visible property values.
  // TODO: ...

  // @NOTE
  // Step: Determine visible & hidden styles.

  const {
    visibleStyles,
    hiddenStyles,
  } = get(componentMeta, 'styles', []).reduce((acc, style) => {
    const conditional = get(style, 'conditional', null);

    if (!conditional) {
      return {
        ...acc,
        visibleStyles: [
          ...acc.visibleStyles,
          style,
        ],
      };
    }

    const result = conditional({
      properties: componentPropertyValues,
      slot: parentComponentSlotMeta,
    });

    const appendTo = !!result ? 'visibleStyles' : 'hiddenStyles';

    return {
      ...acc,
      [appendTo]: [
        ...acc[appendTo],
        style,
      ],
    };
  }, {
    visibleStyles: [],
    hiddenStyles: [],
  });

  if (!!updateWorkspace) {
    queueDispatch(setVisibleStyles({ visibleStyles }));
  }

  // @NOTE
  // Step: Set default values for all visible styles.

  visibleStyles.forEach((style) => {
    const styleId = style.id;

    get(style, 'attributes', []).forEach((attribute) => {
      const attributeId = attribute.id;

      const notResponsive = get(attribute, 'notResponsive', false);
      const defaultValue = get(attribute, 'defaultValue', null);
      const dynamicDefaultThemeValue = get(attribute, 'dynamicDefaultThemeValue', null);

      const hasSetDefault = (device) => isDefined(get(componentStyleValues, `${styleId}.${attributeId}.${device}.inheritFromTheme`))
        || isDefined(get(componentStyleValues, `${styleId}.${attributeId}.${device}.custom`));

      const attributeValue = dynamicDefaultThemeValue
        ? dynamicDefaultThemeValue({ campaignTheme })
        : defaultValue;

      Object.keys(attributeValue || {}).forEach((device) => {
        if (notResponsive && device !== Responsive.MOBILE_DEVICE) {
          return;
        }

        const value = attributeValue[device];

        if (!hasSetDefault(device)) {
          queueDispatch(setComponentInstanceStyle({
            pageId,
            componentId,
            styleId,
            attributeId,
            device,
            value,
          }));
        }
      });
    });
  });

  // @NOTE
  // Step: Determine visible & hidden slots.

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

  // @NOTE
  // Step: Remove children from hidden slots.

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

  // @NOTE
  // Step: Validate visible slots.
  // TODO...
}

const parliamentarian = store => next => action => {
  const result = next(action);

  const shouldRun = TRIGGERS.includes(action.type)
    && get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false) === false;

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
        [PARLIAMENTARIAN_ESCAPE_KEY]: true,
      },
    });
  }));

  console.log('parliamentarian => ', store.getState());

  return result;
}

export default parliamentarian;
