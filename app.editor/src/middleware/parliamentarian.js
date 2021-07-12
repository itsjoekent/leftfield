import { batch } from 'react-redux';
import { find, get, set } from 'lodash';
import {
  ComponentMeta,
  Languages,
  Responsive,
  SiteSettings,
} from 'pkg.campaign-components';
import {
  PARLIAMENTARIAN_BOOTSTRAP_TYPE,
  PARLIAMENTARIAN_ESCAPE_KEY,
} from '@editor/constants/parliamentarian';
import {
  SITE_SETTINGS,
  PAGE_SETTINGS,
} from '@editor/constants/inheritance';
import {
  addChildComponentToSlot,
  buildComponent,
  deleteComponentAndDescendants,
  duplicateComponent,
  removeChildComponentFromSlot,
  reorderChildComponent,
  setComponentPropertyValue,
  setComponentInheritedFrom,
  setComponentStyle,
  setComponentCustomStyle,
  setComponentThemeStyle,
  setCompiledPage,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,

  selectComponent,
  selectComponentInstanceOf,
  selectComponentProperties,
  selectComponentPropertyInheritedFrom,
  selectComponentPropertyInheritedFromForLanguage,
  selectComponentStyles,
  selectComponentTag,
  selectComponentsParentComponentId,
  selectComponentsParentComponentSlotId,
  selectComponentSlot,
  selectLibraryComponentProperties,
  selectPageRootComponentId,
  selectPageSettings,
  selectSiteSettings,
  selectCampaignTheme,
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
  duplicateComponent.toString(),
  removeChildComponentFromSlot.toString(),
  reorderChildComponent.toString(),
  setComponentPropertyValue.toString(),
  setComponentInheritedFrom.toString(),
  setComponentCustomStyle.toString(),
  setComponentThemeStyle.toString(),
  setActiveComponentId.toString(),
  navigateToPast.toString(),
  navigateToFuture.toString(),
  setActivePageId.toString(),
];

function runParliamentarian(
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
  const componentStyleValues = selectComponentStyles(pageId, componentId)(state);

  const componentMeta = ComponentMeta[componentTag];
  const componentProperties = get(componentMeta, 'properties', []);

  const parentComponentId = selectComponentsParentComponentId(pageId, componentId)(state);
  const parentComponentTag = selectComponentTag(pageId, parentComponentId)(state);
  const parentComponentSlotId = selectComponentsParentComponentSlotId(pageId, componentId)(state);
  const parentComponentSlotMeta = find(get(ComponentMeta[parentComponentTag], 'slots'), { id: parentComponentSlotId }) || null;

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

        if (language) {
          return pullTranslatedValue(settingValue, language) !== null;
        }

        return settingValue !== null;
      });

      languages.forEach((language) => {
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
        properties: componentPropertyValues,
        slot: parentComponentSlotMeta,
      });

      Object.keys(dynamicValue).forEach((language) => {
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
    `${SiteSettings.LANGUAGES.key}.${Languages.US_ENGLISH_LANG}`,
    [Languages.US_ENGLISH_LANG],
  );

  runParliamentarian(
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
  console.log('parliamentarian => ', appliedState);

  const pageCompilation = JSON.parse(JSON.stringify(get(appliedState, `assembly.pages.${pageId}`)));
  Object.keys(get(pageCompilation, 'components', {})).forEach((componentId) => {
    const tag = selectComponentTag(pageId, componentId)(appliedState);
    const previewComponentProperties = selectComponentProperties(pageId, componentId)(appliedState);
    const instanceOf = selectComponentInstanceOf(pageId, componentId)(appliedState);
    const instanceOfProperties = selectLibraryComponentProperties(instanceOf)(appliedState);

    Object.keys(previewComponentProperties).forEach((propertyId) => {
      const properties = get(ComponentMeta[tag], `properties`);
      const property = find(properties, { id: propertyId });
      const isTranslatable = get(property, 'isTranslatable', false);

      languages.forEach((language) => {
        if (!isTranslatable && language !== Languages.US_ENGLISH_LANG) {
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
            instanceOf,
            instanceOfProperties,
          ),
        );

        delete pageCompilation.components[componentId].properties[propertyId].inheritedFrom;
      });
    });
  });

  store.dispatch(setCompiledPage({ pageId, compilation: pageCompilation }));
  // console.log('parliamentarian (compiled) => ', store.getState());

  return result;
}

export default parliamentarian;
