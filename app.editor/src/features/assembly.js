import { get, set } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { ComponentMeta, Languages, SiteSettings } from 'pkg.campaign-components';

const defaultSettings = Object.keys(SiteSettings).reduce((acc, key) => ({
  ...acc,
  [key]: get(SiteSettings[key], `field.defaultValue`),
}), {});

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
        settings: {},
        templatedFrom: null,
        rootComponentId: '1',
      },
    },
    siteSettings: {
      ...defaultSettings,
      LANGUAGES: ['en-US', 'es-MX'],
    },
    templates: [],
  },
  reducers: {
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
    addChildComponentInstance: (state, action) => {
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

      delete state[`pages.${pageId}.components.${targetComponentId}`];
    },
    setComponentInstancePropertyValue: (state, action) => {
      const {
        pageId,
        componentId,
        propertyId,
        value,
      } = action.payload;

      set(state, `pages.${pageId}.components.${componentId}.properties.${propertyId}.value`, value);
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
  },
});

export const {
  buildComponent,
  addChildComponentInstance,
  reorderChildComponentInstance,
  removeChildComponentInstance,
  setComponentInstancePropertyValue,
  setComponentInstancePropertyStorage,
} = assemblySlice.actions;

export default assemblySlice.reducer;

export function selectSiteSettings(state) {
  return get(state, 'assembly.siteSettings', {});
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

export function selectComponentPropertyValue(pageId, componentId, propertyId) {
  function _selectComponentPropertyValue(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.value`, null);
  }

  return _selectComponentPropertyValue;
}

export function selectComponentPropertyStorage(pageId, componentId, propertyId, key, language = Languages.US_ENGLISH_LANG) {
  function _selectComponentPropertyStorage(state) {
    return get(selectComponentProperties(pageId, componentId)(state), `${propertyId}.storage.${key}.${language}`, null);
  }

  return _selectComponentPropertyStorage;
}
