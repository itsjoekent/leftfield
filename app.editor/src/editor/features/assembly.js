import { v4 as uuid } from 'uuid';
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
    addChildComponent: (state, action) => {
      const {
        componentTag,
        pageId,
        parentComponentId,
        slotId,
        slotPlacementOrder,
      } = action.payload;

      const insert = {
        id: uuid(),
        tag: componentTag,
        name: `${componentTag} ${Date.now()}`,
      };

      set(state, `pages.${pageId}.components.${insert.id}`, insert);
      set(state, `pages.${pageId}.components.${parentComponentId}.slots.${slotId}[${slotPlacementOrder}]`, insert.id);
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

      children.splice(fromIndex, 1, children.splice(toIndex, 1, children[fromIndex])[0]);
      set(path, children);
    },
  },
});

export const {
  addChildComponent,
  reorderChildComponentInstance,
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
