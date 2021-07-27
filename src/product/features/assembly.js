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
    pageId,
    parentComponentId,
    slotId,
    slotPlacementOrder,
  } = payload;

  const path = `pages.${pageId}.components.${parentComponentId}.slots.${slotId}`;

  const finalSlotPlacementOrder = isNaN(slotPlacementOrder)
    ? get(state, `${path}.length`, 0)
    : slotPlacementOrder

  const children = get(state, path, []);
  children.splice(finalSlotPlacementOrder, 0, componentId);

  set(state, path, children);
  set(state, `pages.${pageId}.components.${componentId}.childOf`, parentComponentId);
  set(state, `pages.${pageId}.components.${componentId}.withinSlot`, slotId);
}

function _removeChildComponentFromSlot(
  state,
  payload,
) {
  const {
    pageId,
    componentId,
    slotId,
    targetIndex,
  } = payload;

  const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
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
      presetSortOrder: {},
    },
    pages: {
      'test': {
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
        settings: {},
        rootComponentId: 'root',
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
        pageId,
      } = action.payload;

      const insert = {
        id: componentId,
        tag: componentTag,
        name: ComponentMeta[componentTag].name,
        version: ComponentMeta[componentTag].version || '0',
      };

      set(state, `pages.${pageId}.components.${insert.id}`, insert);
    },
    deleteComponentAndDescendants: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      const childOf = get(state, `pages.${pageId}.components.${componentId}.childOf`, null);
      const withinSlot = get(state, `pages.${pageId}.components.${componentId}.withinSlot`, null);

      if (!!childOf && !!withinSlot) {
        const targetIndex = get(
          state,
          `pages.${pageId}.components.${childOf}.slots.${withinSlot}`,
          [],
        ).indexOf(componentId);

        _removeChildComponentFromSlot(state, {
          pageId,
          componentId: childOf,
          slotId: withinSlot,
          targetIndex,
        });
      }

      function recursiveDelete(targetComponentId) {
        const slots = get(state, `pages.${pageId}.components.${targetComponentId}.slots`, {});

        Object.keys(slots).forEach((slotId) => {
          slots[slotId].forEach((childId) => recursiveDelete(childId));
        });

        delete state.pages[pageId].components[targetComponentId];
      }

      recursiveDelete(componentId);
    },
    detachStyleReference: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
      } = action.payload;

      const style = selectComponentStyle(pageId, componentId, styleId)({ assembly: state });

      const insert = { ...style };
      delete insert.id;
      delete insert.name;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}`, insert);
    },
    duplicateComponent: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      function recursiveDuplicate(
        targetComponentId,
        parentComponentId,
        parentComponentSlot,
      ) {
        const duplicateComponentId = uuid();
        const originalComponent = get(state, `pages.${pageId}.components.${targetComponentId}`);

        const duplicatedComponent = {
          ...originalComponent,
          id: duplicateComponentId,
          slots: {},
        };

        set(state, `pages.${pageId}.components.${duplicateComponentId}`, duplicatedComponent);

        _addChildComponentToSlot(state, {
          pageId,
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

      const originalComponent = get(state, `pages.${pageId}.components.${componentId}`);

      recursiveDuplicate(
        componentId,
        get(originalComponent, 'childOf'),
        get(originalComponent, 'withinSlot'),
      );
    },
    exportStyle: (state, action) => {
      const {
        pageId,
        componentId,
        presetId,
        styleId,
        styleType,
        styleName,
      } = action.payload;

      const style = selectComponentStyle(pageId, componentId, styleId)({ assembly: state });

      const preset = {
        id: presetId,
        type: styleType,
        name: styleName,
        attributes: style,
      };

      set(state, `stylePresets.${presetId}`, preset);
      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}`, { inheritsFromPreset: presetId });
    },
    importStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        presetId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}`, { inheritsFromPreset: presetId });
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
        pageId,
        componentId,
        slotId,
        fromIndex,
        toIndex,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
      const children = get(state, path, []);

      const [targetComponentId] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, targetComponentId);
      set(state, path, children);
    },
    removeChildComponentFromSlot: (state, action) => _removeChildComponentFromSlot(state, action.payload),
    resetComponentStyleAttribute: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(pageId, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, {});
        return;
      }

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, {});
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
        pageId,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value.${language}`, value);
      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, null);
    },
    setComponentInheritedFrom: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom.${language}`, value);
      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value.${language}`, null);
    },
    setComponentStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(pageId, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, value);
        return;
      }

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, value);
    },
    setComponentCustomStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(pageId, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, { custom: value });
        return;
      }

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { custom: value });
    },
    setComponentThemeStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      const inheritsFromPreset = selectComponentStyleInheritsFrom(pageId, componentId, styleId)({ assembly: state });
      if (isDefined(inheritsFromPreset)) {
        set(state, `stylePresets.${inheritsFromPreset}.attributes.${attributeId}.${device}`, { inheritFromTheme: value });
        return;
      }

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { inheritFromTheme: value });
    },
    setCompiledPage: (state, action) => {
      const { pageId, compilation } = action.payload;
      set(state, `compiled.pages.${pageId}`, compilation);
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
        pageId,
        settingId,
        language,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.settings.${settingId}.${language}`, value);
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
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value`, {});
    },
    wipePropertyInheritedFrom: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.inheritedFrom`, {});
    },
    wipeSlot: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;

      // TODO: replace with calling the recursive code above
      get(state, path, []).forEach((childId) => {
        if (get(state, `pages.${pageId}.components.${childId}`)) {
          delete state.pages[pageId].components[childId];
        }
      });

      set(state, path, []);
    },
    wipeStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.styles.${styleId}`;

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
  detachStyleReference,
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

export function selectMeta(state) {
  return get(state, 'assembly.meta', {});
}

export function selectMetaColorSortOrder(state) {
  return get(selectMeta(state), 'colorSortOrder', []);
}

export function selectMetaPresetSortOrder(styleType) {
  function _selectMetaStyleSortOrder(state) {
    return get(selectMeta(state), `presetSortOrder.${styleType}`, []);
  }

  return _selectMetaStyleSortOrder;
}

export function selectCampaignThemeColorsAsSortedArray(state) {
  const colorSortOrder = selectMetaColorSortOrder(state);
  const colors = selectCampaignThemeColors(state);

  return colorSortOrder
    .map((colorId) => ({ ...colors[colorId], id: colorId }))
    .filter(({ isArchived }) => !isArchived);
}

export function selectPresetsWithType(type) {
  function _selectPresetsWithType(state) {
    const stylePresets = selectPresets(state);
    const presets = Object.keys(stylePresets)
      .map((styleId) => stylePresets[styleId])
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

export function selectPage(pageId) {
  function _selectPage(state) {
    return get(state, `assembly.pages.${pageId}`);
  }

  return _selectPage;
}

export function selectPageSettings(pageId) {
  function _selectPageSettings(state) {
    return get(selectPage(pageId)(state), 'settings', {});
  }

  return _selectPageSettings;
}

export function selectPageName(pageId) {
  function _selectPageName(state) {
    return get(selectPage(pageId)(state), 'name', null);
  }

  return _selectPageName;
}

export function selectPageRootComponentId(pageId) {
  function _selectPageRootComponentId(state) {
    return get(selectPage(pageId)(state), 'rootComponentId', null);
  }

  return _selectPageRootComponentId;
}

export function selectPageComponents(pageId) {
  function _selectPageComponents(state) {
    return get(selectPage(pageId)(state), 'components', null);
  }

  return _selectPageComponents;
}

export function selectComponent(pageId, componentId) {
  function _selectComponent(state) {
    return get(selectPageComponents(pageId)(state), componentId, null);
  }

  return _selectComponent;
}

export function selectComponentTag(pageId, componentId) {
  function _selectComponentTag(state) {
    return get(selectComponent(pageId, componentId)(state), 'tag', null);
  }

  return _selectComponentTag;
}

export function selectComponentName(pageId, componentId) {
  function _selectComponentName(state) {
    return get(selectComponent(pageId, componentId)(state), 'name', null);
  }

  return _selectComponentName;
}

export function selectComponentsParentComponentId(pageId, componentId) {
  function _selectComponentsParentComponentId(state) {
    return get(selectComponent(pageId, componentId)(state), 'childOf', null);
  }

  return _selectComponentsParentComponentId;
}

export function selectComponentsParentComponentSlotId(pageId, componentId) {
  function _selectComponentsParentComponentSlotId(state) {
    return get(selectComponent(pageId, componentId)(state), 'withinSlot', null);
  }

  return _selectComponentsParentComponentSlotId;
}

export function selectComponentSlots(pageId, componentId) {
  function _selectComponentSlots(state) {
    return get(selectComponent(pageId, componentId)(state), 'slots', {});
  }

  return _selectComponentSlots;
}

export function selectComponentSlot(pageId, componentId, slotId) {
  function _selectComponent(state) {
    return get(selectComponentSlots(pageId, componentId)(state), slotId, []);
  }

  return _selectComponent;
}

export function selectComponentSlotMapped(pageId, componentId, slotId) {
  function _selectComponentSlotMapped(state) {
    const componentIds = selectComponentSlot(pageId, componentId, slotId)(state);
    return componentIds
      .map((childId) => selectComponent(pageId, childId)(state))
      .filter((child) => child !== null);
  }

  return _selectComponentSlotMapped;
}

export function selectComponentProperties(pageId, componentId) {
  function _selectComponentProperties(state) {
    return get(selectComponent(pageId, componentId)(state), 'properties', {});
  }

  return _selectComponentProperties;
}

export function selectComponentPropertyValue(pageId, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyValue(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.value.${language}`, null);
  }

  return _selectComponentPropertyValue;
}

export function selectComponentPropertyInheritedFrom(pageId, componentId, propertyId) {
  function _selectComponentPropertyInheritedFrom(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.inheritedFrom`, {});
  }

  return _selectComponentPropertyInheritedFrom;
}

export function selectComponentPropertyInheritedFromForLanguage(pageId, componentId, propertyId, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyInheritedFromForLanguage(state) {
    return get(selectComponentPropertyInheritedFrom(pageId, componentId, propertyId)(state), language, null);
  }

  return _selectComponentPropertyInheritedFromForLanguage;
}

export function selectComponentStyles(pageId, componentId) {
  function _selectComponentStyles(state) {
    return get(selectComponent(pageId, componentId)(state), 'styles', {});
  }

  return _selectComponentStyles;
}

export function selectComponentStyleInheritsFrom(pageId, componentId, styleId) {
  function _selectComponentStyleInheritsFrom(state) {
    return get(selectComponentStyles(pageId, componentId)(state), `${styleId}.inheritsFromPreset`, null);
  }

  return _selectComponentStyleInheritsFrom;
}

export function selectComponentStyle(pageId, componentId, styleId) {
  function _selectComponentStyle(state) {
    const inheritsFromPreset = selectComponentStyleInheritsFrom(pageId, componentId, styleId)(state);

    if (isDefined(inheritsFromPreset)) {
      return selectStyleAttributesFromPreset(inheritsFromPreset, styleId)(state);
    }

    return get(selectComponentStyles(pageId, componentId)(state), styleId, {});
  }

  return _selectComponentStyle;
}

export function selectComponentStyleAttribute(pageId, componentId, styleId, attributeId) {
  function _selectComponentStyleAttribute(state) {
    return get(selectComponentStyle(pageId, componentId, styleId)(state), attributeId, {});
  }

  return _selectComponentStyleAttribute;
}

export function selectComponentStyleAttributeForDevice(pageId, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDevice(state) {
    return get(selectComponentStyleAttribute(pageId, componentId, styleId, attributeId)(state), device, {});
  }

  return _selectComponentStyleAttributeForDevice;
}

export function selectComponentStyleAttributeForDeviceCascading(pageId, componentId, styleId, attributeId, device) {
  function _selectComponentStyleAttributeForDeviceCascading(state) {
    const firstAttempt = selectComponentStyleAttributeForDevice(
      pageId,
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
        pageId,
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

export function selectCompiledPage(pageId) {
  function _selectCompiledPage(state) {
    return get(selectCompiledPages(state), pageId, {});
  }

  return _selectCompiledPage;
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
