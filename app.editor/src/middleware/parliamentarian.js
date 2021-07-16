import { batch } from 'react-redux';
import { find, get, isEmpty, set } from 'lodash';
import {
  ComponentMeta,
  Languages,
  PropertyTypes,
  Responsive,
  Settings,
} from 'pkg.campaign-components';
import {
  PARLIAMENTARIAN_BOOTSTRAP_TYPE,
  PARLIAMENTARIAN_ESCAPE_KEY,
} from '@editor/constants/parliamentarian';
import {
  PAGE_SETTINGS,
  SITE_SETTINGS,
} from '@editor/constants/inheritance';
import {
  addChildComponentToSlot,
  buildComponent,
  deleteComponentAndDescendants,
  detachStyleReference,
  duplicateComponent,
  exportStyle,
  importStyle,
  removeChildComponentFromSlot,
  reorderChildComponent,
  resetComponentStyleAttribute,
  setCampaignThemeKeyValue,
  setComponentPropertyValue,
  setComponentInheritedFrom,
  setComponentStyle,
  setComponentCustomStyle,
  setComponentThemeStyle,
  setCompiledPage,
  setPageSetting,
  setSiteSetting,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,
  wipeStyle,

  selectCampaignTheme,
  selectComponent,
  selectComponentProperties,
  selectComponentPropertyInheritedFrom,
  selectComponentPropertyInheritedFromForLanguage,
  selectComponentPropertyValue,
  selectComponentStyle,
  selectComponentStyles,
  selectComponentStyleAttribute,
  selectComponentStyleAttributeForDevice,
  selectComponentStyleInheritsFrom,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentSlot,
  selectPageRootComponentId,
  selectPageSettings,
  selectSiteSettings,
  selectStyleFromStyleLibrary,
} from '@editor/features/assembly';
import {
  setActiveComponentId,
  setActivePageId,
  setTab,
  setVisibleProperties,
  setVisibleSlots,
  setVisibleStyles,

  navigateToPast,
  navigateToFuture,

  selectActivePageId,
  selectActiveComponentId,
  selectTab,

  PROPERTIES_TAB,
  STYLES_TAB,
  SLOTS_TAB,
  DOCUMENTATION_TAB,
  FEEDBACK_TAB,
  DISABLE_HISTORY,
} from '@editor/features/workspace';
import { getPropertyValue } from '@editor/hooks/useGetPropertyValue';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

const TRIGGERS = [
  PARLIAMENTARIAN_BOOTSTRAP_TYPE,
  addChildComponentToSlot.toString(),
  buildComponent.toString(),
  deleteComponentAndDescendants.toString(),
  detachStyleReference.toString(),
  duplicateComponent.toString(),
  exportStyle.toString(),
  importStyle.toString(),
  navigateToPast.toString(),
  navigateToFuture.toString(),
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  resetComponentStyleAttribute.toString(),
  setActiveComponentId.toString(),
  setActivePageId.toString(),
  setCampaignThemeKeyValue.toString(),
  setComponentPropertyValue.toString(),
  setComponentInheritedFrom.toString(),
  setComponentCustomStyle.toString(),
  setComponentThemeStyle.toString(),
  setPageSetting.toString(),
  setSiteSetting.toString(),
];

function runParliamentarian(
  action,
  queueDispatch,
  state,
  pageId,
  componentId,
  pageSettings,
  siteSettings,
  campaignTheme,
  languages,
  updateWorkspace = true,
) {
  const componentTag = selectComponentTag(pageId, componentId)(state);
  const componentPropertyValues = selectComponentProperties(pageId, componentId)(state);

  const componentMeta = ComponentMeta[componentTag];
  const componentProperties = get(componentMeta, 'properties', []);

  const parentComponentId = selectComponentsParentComponentId(pageId, componentId)(state);
  const parentComponentTag = selectComponentTag(pageId, parentComponentId)(state);
  const parentComponentSlotId = selectComponentsParentComponentSlotId(pageId, componentId)(state);
  const parentComponentSlotMeta = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

  const componentPropertyValuesForConditionals = Object.keys(componentPropertyValues).reduce((acc, propertyId) => {
    const tag = get(componentPropertyValues, `${propertyId}.tag`);
    const property = get(ComponentMeta[tag], `properties`, []);
    const isTranslatable = get(property, 'isTranslatable', false);

    languages.forEach((language) => {
      if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
        return;
      }

      set(
        acc,
        `${propertyId}.value.${language}`,
        getPropertyValue(
          propertyId,
          language,
          pageSettings,
          siteSettings,
          componentTag,
          componentPropertyValues,
        ),
      );
    });

    return acc;
  }, {});

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
      properties: componentPropertyValuesForConditionals,
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
    const isTranslatable = get(property, 'isTranslatable', false);

    const getLocalPropertyValue = (language) => get(componentPropertyValues, `${propertyId}.value.${language}`);

    const hasSetDefault = (language) => !!get(appliedPropertyDefaults, `${propertyId}.${language}`, false)
      || !!(inheritFromSetting && isDefined(
        selectComponentPropertyInheritedFromForLanguage(
          pageId,
          componentId,
          propertyId,
          language,
        )(state)))
      || isDefined(getLocalPropertyValue(language));

    if (!!inheritFromSetting) {
      const search = [
        [pageSettings, PAGE_SETTINGS],
        [siteSettings, SITE_SETTINGS],
      ];

      const settingMatch = (language) => search.find((item) => {
        const [settings] = item;
        const settingValue = get(settings, inheritFromSetting, null);

        return isDefined(pullTranslatedValue(settingValue, language));
      });

      languages.forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        const inheritanceLevel = get(settingMatch(language), '[1]', null);

        if (!!inheritanceLevel && !hasSetDefault(language)) {
          queueDispatch(setComponentInheritedFrom({
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
        properties: componentPropertyValuesForConditionals,
        slot: parentComponentSlotMeta,
      });

      Object.keys(dynamicValue).forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        if (hasSetDefault(language)) {
          return;
        }

        const translatedValue = pullTranslatedValue(dynamicValue, language);

        if (getLocalPropertyValue(language) !== translatedValue) {
          queueDispatch(setComponentPropertyValue({
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
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        if (hasSetDefault(language)) {
          return;
        }

        const translatedValue = pullTranslatedValue(defaultValue, language);

        if (getLocalPropertyValue(language) !== translatedValue) {
          queueDispatch(setComponentPropertyValue({
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

    const hasValue = !isEmpty(
      get(componentPropertyValues, `${propertyId}.value`, {})
    );

    if (hasValue) {
      queueDispatch(wipePropertyValue({
        pageId,
        componentId,
        propertyId,
      }));
    }

    const hasInheritedFrom = !isEmpty(
      selectComponentPropertyInheritedFrom(
        pageId,
        componentId,
        propertyId,
      )(state)
    );

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
      properties: componentPropertyValuesForConditionals,
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

      const getAttributeValue = (device) => {
        return selectComponentStyleAttributeForDevice(
          pageId,
          componentId,
          styleId,
          attributeId,
          device,
        )(state);
      };

      const hasSetDefault = (device) => {
        const attributeValue = getAttributeValue(device);

        return isDefined(get(attributeValue, 'inheritFromTheme'))
          || isDefined(get(attributeValue, 'custom'));
      }

      if (
        action.type === setCampaignThemeKeyValue.toString()
        && get(action, 'payload.path', '').endsWith('isDeleted')
        && get(action, 'payload.value', false)
        && get(attribute, 'type') === PropertyTypes.COLOR_TYPE
      ) {
        const attribute = selectComponentStyleAttribute(pageId, componentId, styleId, attributeId)(state)

        Object.keys(attribute).forEach((device) => {
          const inheritFromTheme = get(getAttributeValue(device), 'inheritFromTheme');
          const themeColor = get(campaignTheme, `colors.${inheritFromTheme}`);

          if (isDefined(inheritFromTheme) && get(themeColor, 'isDeleted', false)) {
            queueDispatch(setComponentStyle({
              pageId,
              componentId,
              styleId,
              attributeId,
              device,
              value: { custom: get(themeColor, 'value') },
            }));
          }
        });
      }

      const defaultAttributeValue = dynamicDefaultThemeValue
        ? dynamicDefaultThemeValue({ campaignTheme })
        : defaultValue;

      Object.keys(defaultAttributeValue || {}).forEach((device) => {
        if (notResponsive && device !== Responsive.MOBILE_DEVICE) {
          return;
        }

        const value = defaultAttributeValue[device];

        if (!hasSetDefault(device)) {
          queueDispatch(setComponentStyle({
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
  // Step: Remove values from hidden styles.

  hiddenStyles.forEach((style) => {
    const styleId = style.id;

    const hasValue = !isEmpty(
      selectComponentStyle(pageId, componentId, styleId)(state)
    );

    if (hasValue) {
      queueDispatch(wipeStyle({
        pageId,
        componentId,
        styleId,
      }));
    }
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
      properties: componentPropertyValuesForConditionals,
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

  // @NOTE
  // Step: Set default workspace tab
  if (!!updateWorkspace) {
    const tabAvailability = {
      [PROPERTIES_TAB]: !!visibleProperties.length,
      [STYLES_TAB]: !!visibleStyles.length,
      [SLOTS_TAB]: !!visibleSlots.length,
      [DOCUMENTATION_TAB]: !!get(componentMeta, 'documentation', '').length,
      [FEEDBACK_TAB]: true,
    };

    if (!tabAvailability[selectTab(state)]) {
      const nextIndex = Object.values(tabAvailability)
        .findIndex((isAvailable) => !!isAvailable);

      const defaultTab = Object.keys(tabAvailability)[nextIndex];
      queueDispatch(setTab({ tab: defaultTab }));
    }
  }
}

const parliamentarian = store => next => action => {
  const result = next(action);

  const shouldRun = TRIGGERS.includes(action.type)
    && get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false) === false;

  if (!shouldRun) {
    return result;
  }

  const state = store.getState();
  const dispatches = [];
  const queueDispatch = (action) => dispatches.push(action);

  const pageId = selectActivePageId(state);
  const componentId = selectActiveComponentId(state);

  if (!isDefined(selectComponent(pageId, componentId)(state))) {
    store.dispatch(setActiveComponentId({
      componentId: selectPageRootComponentId(pageId)(state),
      [DISABLE_HISTORY]: true,
    }));

    return result;
  }

  const pageSettings = selectPageSettings(pageId)(state);
  const siteSettings = selectSiteSettings(state);
  const campaignTheme = selectCampaignTheme(state);

  const languages = get(
    siteSettings,
    `${Settings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  runParliamentarian(
    action,
    queueDispatch,
    state,
    pageId,
    componentId,
    pageSettings,
    siteSettings,
    campaignTheme,
    languages,
    true,
  );

  if (action.type === addChildComponentToSlot.toString()) {
    runParliamentarian(
      action,
      queueDispatch,
      state,
      pageId,
      action.payload.componentId,
      pageSettings,
      siteSettings,
      campaignTheme,
      languages,
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

  const appliedState = store.getState();

  if (process.env.NODE_ENV === 'development') {
    console.log('parliamentarian => ', appliedState);
  }

  const pageCompilation = JSON.parse(JSON.stringify(get(appliedState, `assembly.pages.${pageId}`)));

  Object.keys(get(pageCompilation, 'components', {})).forEach((componentId) => {
    const tag = selectComponentTag(pageId, componentId)(appliedState);
    const previewComponentProperties = selectComponentProperties(pageId, componentId)(appliedState);
    const previewComponentStyles = selectComponentStyles(pageId, componentId)(appliedState);

    Object.keys(previewComponentProperties).forEach((propertyId) => {
      const properties = get(ComponentMeta[tag], `properties`);
      const property = find(properties, { id: propertyId });
      const isTranslatable = get(property, 'isTranslatable', false);

      languages.forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        if (isDefined(selectComponentPropertyValue(pageId, componentId, propertyId, language)(appliedState))) {
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
      const inheritsFromStyle = selectComponentStyleInheritsFrom(
        pageId,
        componentId,
        styleId,
      )(appliedState);

      if (isDefined(inheritsFromStyle)) {
        set(
          pageCompilation,
          `components.${componentId}.styles.${styleId}`,
          {
            ...selectStyleFromStyleLibrary(inheritsFromStyle)(appliedState),
            name: '',
          },
        );
      }
    });
  });

  store.dispatch(setCompiledPage({ pageId, compilation: pageCompilation }));
  // console.log('parliamentarian (compiled) => ', store.getState());

  return result;
}

export default parliamentarian;
