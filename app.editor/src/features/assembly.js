import { get, set } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  ComponentMeta,
  Languages,
  Responsive,
  SiteSettings,
  theme,
} from 'pkg.campaign-components';

const defaultSettings = Object.keys(SiteSettings).reduce((acc, key) => ({
  ...acc,
  [key]: get(SiteSettings[key], `field.defaultValue`),
}), {});

function _addChildComponentInstance(state, action) {
  const {
    pageId,
    componentId,
    parentComponentId,
    slotId,
    slotPlacementOrder,
  } = action.payload;

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

export const assemblySlice = createSlice({
  name: 'assembly',
  initialState: {
    pages: {
      'test': {
        components: {
          '1': {
            id: '1',
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
        templatedFrom: null,
        rootComponentId: '1',
      },
    },
    siteSettings: {
      ...defaultSettings,
      LANGUAGES: {
        [Languages.US_ENGLISH_LANG]: [
          Languages.US_ENGLISH_LANG,
          Languages.MX_SPANISH_LANG,
        ],
      },
    },
    templates: [],
    theme: theme.campaign,
  },
  reducers: {
    addChildComponentInstance: _addChildComponentInstance,
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
      };

      set(state, `pages.${pageId}.components.${insert.id}`, insert);
    },
    duplicateComponent: (state, action) => {
      const {
        pageId,
        componentId,
      } = action.payload;

      const originalComponent = get(state, `pages.${pageId}.components.${componentId}`);
      const duplicatedComponent = {
        ...originalComponent,
        id: uuid(),
      };

      set(state, `pages.${pageId}.components.${duplicatedComponent.id}`, duplicatedComponent);

      _addChildComponentInstance(state, {
        payload: {
          pageId,
          componentId: duplicatedComponent.id,
          parentComponentId: get(originalComponent, 'childOf'),
          slotId: get(originalComponent, 'withinSlot'),
        },
      });
    },
    reorderChildComponentInstance: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
        fromIndex,
        toIndex,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
      const children = get(state, path, []);

      const [targetInstanceId] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, targetInstanceId);
      set(state, path, children);
    },
    removeChildComponentInstance: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
        targetIndex,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;
      const children = get(state, path, []);

      const targetComponentId = children[targetIndex];

      children.splice(targetIndex, 1);
      set(state, path, children);

      if (get(state, `pages.${pageId}.components.${targetComponentId}`)) {
        delete state.pages[pageId].components[targetComponentId];
      }
    },
    resetComponentInstanceStyleAttribute: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, {});
    },
    setComponentInstancePropertyValue: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value.${language}`, value);
    },
    setComponentInstancePropertyStorage: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        key,
        value,
        language = Languages.US_ENGLISH_LANG,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.storage.${key}.${language}`, value);
    },
    setComponentInstanceStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, value);
    },
    setComponentInstanceCustomStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { custom: value });
    },
    setComponentInstanceThemeStyle: (state, action) => {
      const {
        pageId,
        componentId,
        styleId,
        attributeId,
        device,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.styles.${styleId}.${attributeId}.${device}`, { inheritFromTheme: value });
    },
    wipePropertyValue: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value`, {});
    },
    wipePropertyStorage: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.storage`, {});
    },
    wipeSlot: (state, action) => {
      const {
        pageId,
        componentId,
        slotId,
      } = action.payload;

      const path = `pages.${pageId}.components.${componentId}.slots.${slotId}`;

      get(state, path, []).forEach((childId) => {
        if (get(state, `pages.${pageId}.components.${childId}`)) {
          delete state.pages[pageId].components[childId];
        }
      });

      set(state, path, []);
    },
  },
});

export const {
  addChildComponentInstance,
  buildComponent,
  duplicateComponent,
  reorderChildComponentInstance,
  removeChildComponentInstance,
  resetComponentInstanceStyleAttribute,
  setComponentInstancePropertyValue,
  setComponentInstancePropertyStorage,
  setComponentInstanceStyle,
  setComponentInstanceCustomStyle,
  setComponentInstanceThemeStyle,
  wipePropertyValue,
  wipePropertyStorage,
  wipeSlot,
} = assemblySlice.actions;

export default assemblySlice.reducer;

export function selectSiteSettings(state) {
  return get(state, 'assembly.siteSettings', {});
}

export function selectCampaignTheme(state) {
  return get(state, 'assembly.theme', {});
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

export function selectPageTemplateId(pageId) {
  function _selectPageTemplateId(state) {
    return get(selectPage(pageId)(state), 'templatedFrom', null);
  }

  return _selectPageTemplateId;
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
    return componentIds.map((childId) => selectComponent(pageId, childId)(state));
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

export function selectComponentPropertyStorage(pageId, componentId, propertyId) {
  function _selectComponentPropertyStorage(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.storage`, {});
  }

  return _selectComponentPropertyStorage;
}

export function selectComponentPropertyStorageValue(pageId, componentId, propertyId, key, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyStorageValue(state) {
    return get(selectComponentPropertyStorage(pageId, componentId, propertyId)(state), `${key}.${language}`, null);
  }

  return _selectComponentPropertyStorageValue;
}

export function selectComponentStyles(pageId, componentId) {
  function _selectComponentStyles(state) {
    return get(selectComponent(pageId, componentId)(state), 'styles', {});
  }

  return _selectComponentStyles;
}

export function selectComponentStyleAttribute(pageId, componentId, styleId, attributeId) {
  function _selectComponentStyleAttribute(state) {
    return get(selectComponentStyles(pageId, componentId)(state), `${styleId}.${attributeId}`, {});
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

    if (!!Object.keys(firstAttempt).length) {
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
      if (!!Object.keys(acc).length) return acc;

      const nthAttempt = selectComponentStyleAttributeForDevice(
        pageId,
        componentId,
        styleId,
        attributeId,
        cascadingDevice,
      )(state);

      return !!Object.keys(nthAttempt).length
        ? { ...nthAttempt, cascadedFrom: cascadingDevice }
        : acc;
    }, {}) || {};
  }

  return _selectComponentStyleAttributeForDeviceCascading;
}
