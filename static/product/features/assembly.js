import { get, isEmpty, set } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  ComponentMeta,
  Languages,
  Responsive,
  Settings,
  theme,
} from 'pkg.campaign-components';
import isDefined from '@product/utils/isDefined';

const defaultSiteSettings = Settings.SiteSettings.reduce((acc, setting) => ({
  ...acc,
  [setting.id]: get(setting, `defaultValue`),
}), {});

function _addChildComponentToSlot(
  state,
  payload,
) {
  const {
    componentId,
    route,
    parentComponentId,
    slotId,
    slotPlacementOrder,
  } = payload;

  const path = `pages.${route}.components.${parentComponentId}.slots.${slotId}`;

  const finalSlotPlacementOrder = isNaN(slotPlacementOrder)
    ? get(state, `${path}.length`, 0)
    : slotPlacementOrder

  const children = get(state, path, []);
  children.splice(finalSlotPlacementOrder, 0, componentId);

  set(state, path, children);
  set(state, `pages.${route}.components.${componentId}.childOf`, parentComponentId);
  set(state, `pages.${route}.components.${componentId}.withinSlot`, slotId);
}

function _removeChildComponentFromSlot(
  state,
  payload,
) {
  const {
    route,
    componentId,
    slotId,
    targetIndex,
  } = payload;

  const path = `pages.${route}.components.${componentId}.slots.${slotId}`;
  const children = get(state, path, []);

  children.splice(targetIndex, 1);
  set(state, path, children);
}

export const assemblySlice = createSlice({
  name: 'assembly',
  initialState: {
    compiled: {
      pages: {
        'test': {},
      },
    },
    future: [],
    meta: {
      colorSortOrder: Object.keys(theme.campaign.colors),
      fontSortOrder: Object.keys(theme.campaign.fonts),
      presetSortOrder: {},
    },
    pages: {
      '/': {
        id: 'test',
        components: {
          'root': {
            id: 'root',
            tag: ComponentMeta.Root.tag,
            name: ComponentMeta.Root.tag,
            properties: {},
            slots: {
              [ComponentMeta.Root.slots[0].id]: [],
            },
          },
        },
        name: 'Test page',
        rootComponentId: 'root',
        route: '/',
        settings: {},
      },
    },
    past: [],
    siteSettings: {
      ...defaultSiteSettings,
      [Settings.LANGUAGES.key]: {
        [Languages.US_ENGLISH_LANG]: [
          Languages.US_ENGLISH_LANG,
          Languages.MX_SPANISH_LANG,
        ],
      },
    },
    stylePresets: {},
    templatedFrom: null,
    theme: theme.campaign,
    websiteId: null,
    websiteName: null,
    websiteDomain: null,
  },
  reducers: {
    addChildComponentToSlot: (state, action) => _addChildComponentToSlot(state, action.payload),
    addPastState: (state, action) => {
      const assemblyState = {
        pages: state.pages,
        siteSettings: state.siteSettings,
        stylePresets: state.stylePresets,
        templatedFrom: state.templatedFrom,
        theme: state.theme,
      };

      set(state, 'past', [...get(state, 'past', []), assemblyState]);
      set(state, 'future', []);
    },
    archivePreset: (state, action) => {
      const { presetId } = action.payload;
      set(state, `stylePresets.${presetId}.isArchived`, true);
    },
    buildComponent: (state, action) => {
      const {
        componentId,
        componentTag,
        route,
      } = action.payload;

      const insert = {
        id: componentId,
        tag: componentTag,
        name: ComponentMeta[componentTag].name,
        version: ComponentMeta[componentTag].version || '0',
      };

      set(state, `pages.${route}.components.${insert.id}`, insert);
    },
    deleteComponentAndDescendants: (state, action) => {
      const {
        route,
        componentId,
      } = action.payload;

      const childOf = get(state, `pages.${route}.components.${componentId}.childOf`, null);
      const withinSlot = get(state, `pages.${route}.components.${componentId}.withinSlot`, null);

      if (!!childOf && !!withinSlot) {
        const targetIndex = get(
          state,
          `pages.${route}.components.${childOf}.slots.${withinSlot}`,
          [],
        ).indexOf(componentId);

        _removeChildComponentFromSlot(state, {
          route,
          componentId: childOf,
          slotId: withinSlot,
          targetIndex,
        });
      }

      function recursiveDelete(targetComponentId) {
        const slots = get(state, `pages.${route}.components.${targetComponentId}.slots`, {});

        Object.keys(slots).forEach((slotId) => {
          slots[slotId].forEach((childId) => recursiveDelete(childId));
        });

        delete state.pages[route].components[targetComponentId];
      }

      recursiveDelete(componentId);
    },
    detachPreset: (state, action) => {
      const {
        route,
        componentId,
        styleId,
      } = action.payload;

      const style = selectComponentStyle(route, componentId, styleId)({ assembly: state });

      const insert = { ...style };
      delete insert.id;
      delete insert.name;

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}`, insert);
    },
    duplicateComponent: (state, action) => {
      const {
        route,
        componentId,
      } = action.payload;

      function recursiveDuplicate(
        targetComponentId,
        parentComponentId,
        parentComponentSlot,
      ) {
        const duplicateComponentId = uuid();
        const originalComponent = get(state, `pages.${route}.components.${targetComponentId}`);

        const duplicatedComponent = {
          ...originalComponent,
          id: duplicateComponentId,
          slots: {},
        };

        set(state, `pages.${route}.components.${duplicateComponentId}`, duplicatedComponent);

        _addChildComponentToSlot(state, {
          route,
          componentId: duplicateComponentId,
          parentComponentId: parentComponentId,
          slotId: parentComponentSlot,
        });

        const slots = get(originalComponent, 'slots', {});

        Object.keys(slots).forEach((slotId) => {
          slots[slotId].forEach((childId) => recursiveDuplicate(
            childId,
            duplicateComponentId,
            slotId,
          ));
        });
      }

      const originalComponent = get(state, `pages.${route}.components.${componentId}`);

      recursiveDuplicate(
        componentId,
        get(originalComponent, 'childOf'),
        get(originalComponent, 'withinSlot'),
      );
    },
    exportStyle: (state, action) => {
      const {
        route,
        componentId,
        presetId,
        styleId,
        styleType,
        styleName,
      } = action.payload;

      const style = selectComponentStyle(route, componentId, styleId)({ assembly: state });

      const preset = {
        id: presetId,
        type: styleType,
        name: styleName,
        attributes: style,
      };

      set(state, `stylePresets.${presetId}`, preset);
      set(state, `pages.${route}.components.${componentId}.styles.${styleId}`, { inheritsFromPreset: presetId });
    },
    importStyle: (state, action) => {
      const {
        route,
        componentId,
        styleId,
        presetId,
      } = action.payload;

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}`, { inheritsFromPreset: presetId });
    },
    redo: (state, action) => {
      const futureState = state.future.pop();
      if (!futureState) {
        return;
      }

      const assemblyState = {
        pages: state.pages,
        siteSettings: state.siteSettings,
        stylePresets: state.stylePresets,
        templatedFrom: state.templatedFrom,
        theme: state.theme,
      };

      state.past.push(assemblyState);

      Object.keys(futureState).forEach((key) => {
        set(state, key, futureState[key]);
      });
    },
    reorderChildComponent: (state, action) => {
      const {
        route,
        componentId,
        slotId,
        fromIndex,
        toIndex,
      } = action.payload;

      const path = `pages.${route}.components.${componentId}.slots.${slotId}`;
      const children = get(state, path, []);

      const [targetComponentId] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, targetComponentId);
      set(state, path, children);
    },
    removeChildComponentFromSlot: (state, action) => _removeChildComponentFromSlot(state, action.payload),
    resetComponentStyleAttribute: (state, action) => {
      const {
        route,
        componentId,
        styleId,
        attributeId,
        device,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(route, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, {});
        return;
      }

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, {});
    },
    setAssemblyState: (state, action) => {
      const { newAssembly } = action.payload;

      Object.keys(newAssembly).forEach((key) => {
        set(state, key, newAssembly[key]);
      });
    },
    setCampaignThemeKeyValue: (state, action) => {
      const {
        path,
        value,
      } = action.payload;

      set(state, `theme.${path}`, value);
    },
    setComponentPropertyValue: (state, action) => {
      const {
        route,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.value.${language}`, value);
      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, null);
    },
    setComponentInheritedFrom: (state, action) => {
      const {
        route,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, value);
      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.value.${language}`, null);
    },
    setComponentStyle: (state, action) => {
      const {
        route,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(route, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, value);
        return;
      }

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, value);
    },
    setComponentCustomStyle: (state, action) => {
      const {
        route,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(route, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, { custom: value });
        return;
      }

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { custom: value });
    },
    setComponentThemeStyle: (state, action) => {
      const {
        route,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(route, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, { inheritFromTheme: value });
        return;
      }

      set(state, `pages.${route}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { inheritFromTheme: value });
    },
    setCompiledPage: (state, action) => {
      const { route, compilation } = action.payload;
      set(state, `compiled.pages.${route}`, compilation);
    },
    setPresetName: (state, action) => {
      const { presetId, name } = action.payload;
      set(state, `stylePresets.${presetId}.name`, name);
    },
    setMetaValue: (state, action) => {
      const { op, path, value } = action.payload;

      if (!!op) {
        switch (op) {
          case '$PULL': {
            const { index } = action.payload;

            const sourceArray = get(selectMeta({ assembly: state }), path, []);
            sourceArray.splice(index, 1);

            set(state, `meta.${path}`, sourceArray);
            return;
          }

          case '$PUSH': {
            const { item } = action.payload;

            const sourceArray = get(selectMeta({ assembly: state }), path, []);
            sourceArray.push(item);

            set(state, `meta.${path}`, sourceArray);
            return;
          }

          case '$REORDER': {
            const { fromIndex, toIndex } = action.payload;

            const sourceArray = [...get(selectMeta({ assembly: state }), path, [])];
            const [target] = sourceArray.splice(fromIndex, 1);
            sourceArray.splice(toIndex, 0, target);

            set(state, `meta.${path}`, sourceArray);
            return;
          }

          default: return;
        }
      }

      set(state, `meta.${path}`, value);
    },
    setPageSetting: (state, action) => {
      const {
        route,
        settingId,
        language,
        value,
      } = action.payload;

      set(state, `pages.${route}.settings.${settingId}.${language}`, value);
    },
    setSiteSetting: (state, action) => {
      const {
        settingId,
        language,
        value,
      } = action.payload;

      set(state, `siteSettings.${settingId}.${language}`, value);
    },
    setWebsiteId: (state, action) => {
      const { websiteId } = action.payload;
      set(state, 'websiteId', websiteId);
    },
    undo: (state, action) => {
      const previousState = state.past.pop();
      if (!previousState) {
        return;
      }

      const assemblyState = {
        pages: state.pages,
        siteSettings: state.siteSettings,
        stylePresets: state.stylePresets,
        templatedFrom: state.templatedFrom,
        theme: state.theme,
      };

      state.future.push(assemblyState);

      Object.keys(previousState).forEach((key) => {
        set(state, key, previousState[key]);
      });
    },
    wipePropertyValue: (state, action) => {
      const {
        route,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.value`, {});
    },
    wipePropertyInheritedFrom: (state, action) => {
      const {
        route,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${route}.components.${componentId}.properties.${propertyId}.inheritedFrom`, {});
    },
    wipeSlot: (state, action) => {
      const {
        route,
        componentId,
        slotId,
      } = action.payload;

      const path = `pages.${route}.components.${componentId}.slots.${slotId}`;

      // TODO: replace with calling the recursive code above
      get(state, path, []).forEach((childId) => {
        if (get(state, `pages.${route}.components.${childId}`)) {
          delete state.pages[route].components[childId];
        }
      });

      set(state, path, []);
    },
    wipeStyle: (state, action) => {
      const {
        route,
        componentId,
        styleId,
      } = action.payload;

      const path = `pages.${route}.components.${componentId}.styles.${styleId}`;

      set(state, path, {});
    },
  },
});

export const {
  addChildComponentToSlot,
  addPastState,
  archivePreset,
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
  setAssemblyState,
  setCampaignThemeKeyValue,
  setComponentPropertyValue,
  setComponentInheritedFrom,
  setComponentStyle,
  setComponentCustomStyle,
  setComponentThemeStyle,
  setCompiledPage,
  setPresetName,
  setMetaValue,
  setPageSetting,
  setSiteSetting,
  setWebsiteId,
  undo,
  wipePropertyValue,
  wipePropertyInheritedFrom,
  wipeSlot,
  wipeStyle,
} = assemblySlice.actions;

export default assemblySlice.reducer;

export function selectCampaignTheme(state) {
  return get(state, 'assembly.theme', {});
}

export function selectCampaignThemeColors(state) {
  return get(selectCampaignTheme(state), 'colors');
}

export function selectCampaignThemeColorsAsSortedArray(state) {
  const colorSortOrder = selectMetaColorSortOrder(state);
  const colors = selectCampaignThemeColors(state);

  return colorSortOrder
    .map((colorId) => ({ ...colors[colorId], id: colorId }))
    .filter(({ isArchived }) => !isArchived);
}

export function selectCampaignThemeFont(fontId) {
  function _selectCampaignThemeFont(state) {
    return get(selectCampaignTheme(state), `fonts.${fontId}`, {});
  }

  return _selectCampaignThemeFont;
}

function selectCampaignThemeFonts(state) {
  return get(selectCampaignTheme(state), 'fonts');
}

export function selectCampaignThemeFontsAsSortedArray(state) {
  const fontSortOrder = selectMetaFontSortOrder(state);
  const fonts = selectCampaignThemeFonts(state);

  return fontSortOrder
    .map((fontId) => ({ ...fonts[fontId], id: fontId }))
    .filter(({ isArchived }) => !isArchived);
}

export function selectCampaignThemeFontWeights(fontId) {
  function _selectCampaignThemeFontWeights(state) {
    return get(selectCampaignTheme(state), `fontWeights.${fontId}`, {});
  }

  return _selectCampaignThemeFontWeights;
}

export function selectMeta(state) {
  return get(state, 'assembly.meta', {});
}

export function selectMetaColorSortOrder(state) {
  return get(selectMeta(state), 'colorSortOrder', []);
}

export function selectMetaFontSortOrder(state) {
  return get(selectMeta(state), 'fontSortOrder', []);
}

export function selectMetaPresetSortOrder(styleType) {
  function _selectMetaStyleSortOrder(state) {
    return get(selectMeta(state), `presetSortOrder.${styleType}`, []);
  }

  return _selectMetaStyleSortOrder;
}

export function selectPresets(state) {
  return get(state, 'assembly.stylePresets', {});
}

export function selectPreset(styleId) {
  function _selectPreset(state) {
    return get(selectPresets(state), styleId, {});
  }

  return _selectPreset;
}

export function selectPresetsWithType(type) {
  function _selectPresetsWithType(state) {
    const stylePresets = selectPresets(state);
    const presets = Object.keys(stylePresets)
      .map((presetId) => stylePresets[presetId])
      .filter((preset) => !preset.isArchived && preset.type === type);

    return presets;
  }

  return _selectPresetsWithType;
}

export function selectPresetsOfTypeSortedAsArray(styleType) {
  function _selectPresetsOfTypeSortedAsArray(state) {
    const presetSortOrder = selectMetaPresetSortOrder(styleType)(state);

    return presetSortOrder
      .map((presetId) => selectPreset(presetId)(state))
      .filter((preset) => !get(preset, 'isArchived', false));
  }

  return _selectPresetsOfTypeSortedAsArray;
}

export function selectSiteSettings(state) {
  return get(state, 'assembly.siteSettings', {});
}

export function selectSiteTemplateId(state) {
  return get(state, 'assembly.templatedFrom', null);
}

export function selectPage(route) {
  function _selectPage(state) {
    return get(state, `assembly.pages.${route}`);
  }

  return _selectPage;
}

export function selectPageSettings(route) {
  function _selectPageSettings(state) {
    return get(selectPage(route)(state), 'settings', {});
  }

  return _selectPageSettings;
}

export function selectPageName(route) {
  function _selectPageName(state) {
    return get(selectPage(route)(state), 'name', null);
  }

  return _selectPageName;
}

export function selectPageRootComponentId(route) {
  function _selectPageRootComponentId(state) {
    return get(selectPage(route)(state), 'rootComponentId', null);
  }

  return _selectPageRootComponentId;
}

export function selectPageComponents(route) {
  function _selectPageComponents(state) {
    return get(selectPage(route)(state), 'components', null);
  }

  return _selectPageComponents;
}

export function selectComponent(route, componentId) {
  function _selectComponent(state) {
    return get(selectPageComponents(route)(state), componentId, null);
  }

  return _selectComponent;
}

export function selectComponentTag(route, componentId) {
  function _selectComponentTag(state) {
    return get(selectComponent(route, componentId)(state), 'tag', null);
  }

  return _selectComponentTag;
}

export function selectComponentName(route, componentId) {
  function _selectComponentName(state) {
    return get(selectComponent(route, componentId)(state), 'name', null);
  }

  return _selectComponentName;
}

export function selectComponentsParentComponentId(route, componentId) {
  function _selectComponentsParentComponentId(state) {
    return get(selectComponent(route, componentId)(state), 'childOf', null);
  }

  return _selectComponentsParentComponentId;
}

export function selectComponentsParentComponentSlotId(route, componentId) {
  function _selectComponentsParentComponentSlotId(state) {
    return get(selectComponent(route, componentId)(state), 'withinSlot', null);
  }

  return _selectComponentsParentComponentSlotId;
}

export function selectComponentSlots(route, componentId) {
  function _selectComponentSlots(state) {
    return get(selectComponent(route, componentId)(state), 'slots', {});
  }

  return _selectComponentSlots;
}

export function selectComponentSlot(route, componentId, slotId) {
  function _selectComponent(state) {
    return get(selectComponentSlots(route, componentId)(state), slotId, []);
  }

  return _selectComponent;
}

export function selectComponentSlotMapped(route, componentId, slotId) {
  function _selectComponentSlotMapped(state) {
    const componentIds = selectComponentSlot(route, componentId, slotId)(state);
    return componentIds
      .map((childId) => selectComponent(route, childId)(state))
      .filter((child) => child !== null);
  }

  return _selectComponentSlotMapped;
}

export function selectComponentProperties(route, componentId) {
  function _selectComponentProperties(state) {
    return get(selectComponent(route, componentId)(state), 'properties', {});
  }

  return _selectComponentProperties;
}

export function selectComponentPropertyValue(route, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyValue(state) {
    return get(selectComponentProperties(route, componentId)(state), `${propertyId}.value.${language}`, null);
  }

  return _selectComponentPropertyValue;
}

export function selectComponentPropertyInheritedFrom(route, componentId, propertyId) {
  function _selectComponentPropertyInheritedFrom(state) {
    return get(selectComponentProperties(route, componentId)(state), `${propertyId}.inheritedFrom`, {});
  }

  return _selectComponentPropertyInheritedFrom;
}

export function selectComponentPropertyInheritedFromForLanguage(route, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyInheritedFromForLanguage(state) {
    return get(selectComponentPropertyInheritedFrom(route, componentId, propertyId)(state), language, null);
  }

  return _selectComponentPropertyInheritedFromForLanguage;
}

export function selectComponentStyles(route, componentId) {
  function _selectComponentStyles(state) {
    return get(selectComponent(route, componentId)(state), 'styles', {});
  }

  return _selectComponentStyles;
}

export function selectComponentStyleInheritsFrom(route, componentId, styleId) {
  function _selectComponentStyleInheritsFrom(state) {
    return get(selectComponentStyles(route, componentId)(state), `${styleId}.inheritsFromPreset`, null);
  }

  return _selectComponentStyleInheritsFrom;
}

export function selectComponentStyle(route, componentId, styleId) {
  function _selectComponentStyle(state) {
    const inheritsFromPreset = selectComponentStyleInheritsFrom(route, componentId, styleId)(state);

    if (isDefined(inheritsFromPreset)) {
      return selectStyleAttributesFromPreset(inheritsFromPreset, styleId)(state);
    }

    return get(selectComponentStyles(route, componentId)(state), styleId, {});
  }

  return _selectComponentStyle;
}

export function selectComponentStyleAttribute(route, componentId, styleId, attributeId) {
  function _selectComponentStyleAttribute(state) {
    return get(selectComponentStyle(route, componentId, styleId)(state), attributeId, {});
  }

  return _selectComponentStyleAttribute;
}

export function selectComponentStyleAttributeForDevice(route, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDevice(state) {
    return get(selectComponentStyleAttribute(route, componentId, styleId, attributeId)(state), device, {});
  }

  return _selectComponentStyleAttributeForDevice;
}

export function selectComponentStyleAttributeForDeviceCascading(route, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDeviceCascading(state) {
    const firstAttempt = selectComponentStyleAttributeForDevice(
      route,
      componentId,
      styleId,
      attributeId,
      device,
    )(state);

    if (!isEmpty(firstAttempt)) {
      return firstAttempt;
    }

    const cascading = {
      [Responsive.DESKTOP_DEVICE]: [
        Responsive.TABLET_DEVICE,
        Responsive.MOBILE_DEVICE,
      ],
      [Responsive.MOBILE_DEVICE]: [],
      [Responsive.TABLET_DEVICE]: [Responsive.MOBILE_DEVICE],
    };

    return cascading[device].reduce((acc, cascadingDevice) => {
      if (!isEmpty(acc)) return acc;

      const nthAttempt = selectComponentStyleAttributeForDevice(
        route,
        componentId,
        styleId,
        attributeId,
        cascadingDevice,
      )(state);

      return !isEmpty(nthAttempt)
        ? { ...nthAttempt, cascadedFrom: cascadingDevice }
        : acc;
    }, {}) || {};
  }

  return _selectComponentStyleAttributeForDeviceCascading;
}

export function selectCompiledPages(state) {
  return get(state, 'assembly.compiled.pages', {});
}

export function selectCompiledPage(route) {
  function _selectCompiledPage(state) {
    return get(selectCompiledPages(state), route, {});
  }

  return _selectCompiledPage;
}

export function selectPresetName(styleId) {
  function _selectPresetName(state) {
    return get(selectPreset(styleId)(state), 'name', null);
  }

  return _selectPresetName;
}

export function selectStyleAttributesFromPreset(styleId) {
  function _selectStyleAttributesFromPreset(state) {
    return get(selectPreset(styleId)(state), 'attributes', {});
  }

  return _selectStyleAttributesFromPreset;
}

export function selectWebsiteId(state) {
  return get(state, 'assembly.websiteId', null);
}

export function selectHasUndo(state) {
  return !!get(state, 'assembly.past', []).length;
}

export function selectHasRedo(state) {
  return !!get(state, 'assembly.future', []).length;
}
