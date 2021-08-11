import { batch } from 'react-redux';
import { find, get, isEmpty, set } from 'lodash';
import {
  ComponentMeta,
  Languages,
  Responsive,
  Settings,
} from 'pkg.campaign-components';
import {
  PARLIAMENTARIAN_BOOTSTRAP_TYPE,
  PARLIAMENTARIAN_ESCAPE_KEY,
} from '@product/constants/parliamentarian';
import {
  PAGE_SETTINGS,
  SITE_SETTINGS,
} from '@product/constants/inheritance';
import {
  addChildComponentToSlot,
  addPastState,
  buildComponent,
  deleteComponentAndDescendants,
  detachPreset,
  duplicateComponent,
  exportStyle,
  importStyle,
  redo,
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
  setWebsiteId,
  undo,
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
  selectComponentSlots,
  selectComponentStyle,
  selectComponentStyles,
  selectComponentStyleAttribute,
  selectComponentStyleAttributeForDevice,
  selectComponentStyleAttributeForDeviceCascading,
  selectComponentStyleInheritsFrom,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentSlot,
  selectPageRootComponentId,
  selectPageSettings,
  selectPresetsOfTypeSortedAsArray,
  selectSiteSettings,
  selectStyleAttributesFromPreset,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import {
  setActiveComponentId,
  setActivePageRoute,
  setTab,
  setVisibleProperties,
  setVisibleSlots,
  setVisibleStyles,

  navigateToPast,
  navigateToFuture,

  selectActivePageRoute,
  selectActiveComponentId,
  selectTab,

  PROPERTIES_TAB,
  STYLES_TAB,
  SLOTS_TAB,
  DOCUMENTATION_TAB,
  FEEDBACK_TAB,
  DISABLE_HISTORY,
} from '@product/features/workspace';
import { getPropertyValue } from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';
import pullTranslatedValue from '@product/utils/pullTranslatedValue';

const TRIGGERS = [
  PARLIAMENTARIAN_BOOTSTRAP_TYPE,
  addChildComponentToSlot.toString(),
  buildComponent.toString(),
  deleteComponentAndDescendants.toString(),
  detachPreset.toString(),
  duplicateComponent.toString(),
  exportStyle.toString(),
  importStyle.toString(),
  navigateToPast.toString(),
  navigateToFuture.toString(),
  redo.toString(),
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  resetComponentStyleAttribute.toString(),
  setActiveComponentId.toString(),
  setActivePageRoute.toString(),
  setCampaignThemeKeyValue.toString(),
  setComponentPropertyValue.toString(),
  setComponentInheritedFrom.toString(),
  setComponentCustomStyle.toString(),
  setComponentThemeStyle.toString(),
  setPageSetting.toString(),
  setSiteSetting.toString(),
  setTab.toString(),
  setWebsiteId.toString(),
  undo.toString(),
];

const RECORD_ASSEMBLY_HISTORY = [
  addChildComponentToSlot.toString(),
  buildComponent.toString(),
  deleteComponentAndDescendants.toString(),
  detachPreset.toString(),
  duplicateComponent.toString(),
  exportStyle.toString(),
  importStyle.toString(),
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  resetComponentStyleAttribute.toString(),
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
  route,
  componentId,
  previewDevice,
  pageSettings,
  siteSettings,
  campaignTheme,
  languages,
  updateWorkspace = true,
) {
  const componentTag = selectComponentTag(route, componentId)(state);
  const componentPropertyValues = selectComponentProperties(route, componentId)(state);
  const componentSlotValues = selectComponentSlots(route, componentId)(state);

  const componentMeta = ComponentMeta[componentTag];
  const componentProperties = get(componentMeta, 'properties', []);

  const parentComponentId = selectComponentsParentComponentId(route, componentId)(state);
  const parentComponentTag = selectComponentTag(route, parentComponentId)(state);
  const parentComponentSlotId = selectComponentsParentComponentSlotId(route, componentId)(state);
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
      slots: componentSlotValues,
      withinSlot: parentComponentSlotMeta,
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
          route,
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
            route,
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
        slots: componentSlotValues,
        withinSlot: parentComponentSlotMeta,
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
            route,
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
            route,
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
        route,
        componentId,
        propertyId,
      }));
    }

    const hasInheritedFrom = !isEmpty(
      selectComponentPropertyInheritedFrom(
        route,
        componentId,
        propertyId,
      )(state)
    );

    if (hasInheritedFrom) {
      queueDispatch(wipePropertyInheritedFrom({
        route,
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

    const attributes = get(style, 'attributes', []).filter((attribute) => {
      const hideIf = get(attribute, 'hideIf', null);
      if (!hideIf) {
        return true;
      }

      const { compare, test } = hideIf;
      const compareValue = selectComponentStyleAttributeForDeviceCascading(
        route,
        componentId,
        style.id,
        compare,
        previewDevice,
      )(state);

      return !test(compareValue);
    });

    const finalStyle = {
      ...style,
      attributes,
    };

    if (!conditional) {
      return {
        ...acc,
        visibleStyles: [
          ...acc.visibleStyles,
          finalStyle,
        ],
      };
    }

    const result = conditional({
      properties: componentPropertyValuesForConditionals,
      slots: componentSlotValues,
      withinSlot: parentComponentSlotMeta,
    });

    const appendTo = !!result ? 'visibleStyles' : 'hiddenStyles';

    return {
      ...acc,
      [appendTo]: [
        ...acc[appendTo],
        finalStyle,
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
  // Step: Set default values for all visible styles OR pick default preset.

  visibleStyles.forEach((style) => {
    const styleId = style.id;
    const styleType = get(style, 'type', null);

    const hasStyleValue = !isEmpty(
      selectComponentStyle(route, componentId, styleId)(state)
    );

    if (!hasStyleValue) {
      const presets = selectPresetsOfTypeSortedAsArray(styleType)(state);

      if (!!presets && !!presets.length) {
        const apply = presets[0];

        queueDispatch(importStyle({
          route,
          componentId,
          styleId,
          presetId: get(apply, 'id'),
        }));

        return;
      }
    }

    get(style, 'attributes', []).forEach((attribute) => {
      const attributeId = attribute.id;

      const notResponsive = get(attribute, 'notResponsive', false);
      const defaultValue = get(attribute, 'defaultValue', null);
      const dynamicDefaultThemeValue = get(attribute, 'dynamicDefaultThemeValue', null);

      const getAttributeValue = (device) => {
        return selectComponentStyleAttributeForDevice(
          route,
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
            route,
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
      selectComponentStyle(route, componentId, styleId)(state)
    );

    if (hasValue) {
      queueDispatch(wipeStyle({
        route,
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
      withinSlot: parentComponentSlotMeta,
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
    const hasChildren = !!selectComponentSlot(route, componentId, slotId)(state).length;

    if (hasChildren) {
      queueDispatch(wipeSlot({
        route,
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
  if (
    RECORD_ASSEMBLY_HISTORY.includes(action.type)
    && get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false) === false
  ) {
    store.dispatch(addPastState());
  }

  const result = next(action);

  const shouldRun = TRIGGERS.includes(action.type)
    && get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false) === false;

  if (!shouldRun) {
    return result;
  }

  const state = store.getState();
  const dispatches = [];
  const queueDispatch = (action) => dispatches.push(action);

  const route = selectActivePageRoute(state);
  const componentId = selectActiveComponentId(state);

  if (!isDefined(selectComponent(route, componentId)(state))) {
    store.dispatch(setActiveComponentId({
      componentId: selectPageRootComponentId(route)(state),
      [DISABLE_HISTORY]: true,
    }));

    return result;
  }

  const previewDevice = selectPreviewDeviceSize(state);

  const pageSettings = selectPageSettings(route)(state);
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
    route,
    componentId,
    previewDevice,
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
      route,
      action.payload.componentId,
      previewDevice,
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
    console.groupCollapsed(`parliamentarian => ${action.type}`);
    console.log('Action:', action.payload);
    console.log('Initial State:', state);
    console.log('Updated State:', appliedState);
    console.groupEnd();
  }

  const pageCompilation = JSON.parse(JSON.stringify(get(appliedState, `assembly.pages.${route}`)));

  Object.keys(get(pageCompilation, 'components', {})).forEach((componentId) => {
    const tag = selectComponentTag(route, componentId)(appliedState);
    const previewComponentProperties = selectComponentProperties(route, componentId)(appliedState);
    const previewComponentStyles = selectComponentStyles(route, componentId)(appliedState);

    Object.keys(previewComponentProperties).forEach((propertyId) => {
      const properties = get(ComponentMeta[tag], `properties`);
      const property = find(properties, { id: propertyId });
      const isTranslatable = get(property, 'isTranslatable', false);

      languages.forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
          return;
        }

        if (isDefined(selectComponentPropertyValue(route, componentId, propertyId, language)(appliedState))) {
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
      )(appliedState);

      if (isDefined(inheritsFromPreset)) {
        set(
          pageCompilation,
          `components.${componentId}.styles.${styleId}`,
          selectStyleAttributesFromPreset(inheritsFromPreset)(appliedState),
        );
      }
    });
  });

  store.dispatch(setCompiledPage({ route, compilation: pageCompilation }));
  // console.log('parliamentarian (compiled) => ', store.getState());

  return result;
}

export default parliamentarian;
