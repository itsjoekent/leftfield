import { get, set } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { ComponentMeta } from 'pkg.campaign-components';

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
    siteSettings: {},
    templates: {},
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

      children.splice(targetIndex, 1);
      set(state, path, children);
    },
  },
});

export const {
  buildComponent,
  addChildComponentInstance,
  reorderChildComponentInstance,
  removeChildComponentInstance,
} = assemblySlice.actions;

export default assemblySlice.reducer;

export function selectPageComponents(pageId) {
  function _selectPageComponents(state) {
    return get(state, `assembly.pages.${pageId}.components`, null);
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
