import { get } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { PARLIAMENTARIAN_ESCAPE_KEY } from '@editor/constants/parliamentarian';

export const PROPERTIES_TAB = 'PROPERTIES_TAB';
export const STYLES_TAB = 'STYLES_TAB';
export const SLOTS_TAB = 'SLOTS_TAB';
export const DOCUMENTATION_TAB = 'DOCUMENTATION_TAB';
export const FEEDBACK_TAB = 'FEEDBACK_TAB';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    activeComponentId: '1',
    past: [],
    future: [],
    isComponentTreeOpen: false,
    isComponentInspecting: false, // TODO: remove
    activePageId: 'test',
    tab: PROPERTIES_TAB,
    visibleProperties: [],
    visibleSlots: [],
    visibleStyles: [],
  },
  reducers: {
    setTab: (state, action) => {
      if (!get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.tab = action.payload.tab;
    },
    setActivePageId: (state, action) => {
      if (!get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.activePageId = action.payload.pageId;
      state.isComponentTreeOpen = false;
    },
    setActiveComponentId: (state, action) => {
      if (!get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.activeComponentId = action.payload.componentId;
      state.isComponentTreeOpen = false;
    },
    setIsComponentTreeOpen: (state, action) => {
      state.isComponentTreeOpen = action.payload;

      if (!action.payload) {
        state.isComponentInspecting = false;
      }
    },
    setIsComponentInspecting: (state, action) => {
      state.isComponentInspecting = action.payload;
    },
    navigateToPast: (state, action) => {
      const past = state.past.pop();console.log(past);
      state.future.push({
        componentId: state.activeComponentId,
        pageId: state.activePageId,
        tab: state.tab,
      });

      state.activeComponentId = past.componentId;
      state.activePageId = past.pageId;
      state.tab = past.tab;

      state.isComponentTreeOpen = false;
    },
    navigateToFuture: (state, action) => {
      const next = state.future.pop();
      state.past.push({
        componentId: state.activeComponentId,
        pageId: state.activePageId,
        tab: state.tab,
      });

      state.activeComponentId = next.componentId;
      state.activePageId = next.pageId;
      state.tab = next.tab;

      state.isComponentTreeOpen = false;
    },
    setVisibleProperties: (state, action) => {
      state.visibleProperties = action.payload.visibleProperties;
    },
    setVisibleSlots: (state, action) => {
      state.visibleSlots = action.payload.visibleSlots;
    },
    setVisibleStyles: (state, action) => {
      state.visibleStyles = action.payload.visibleStyles;
    },
  },
});

export const {
  setActivePageId,
  setActiveComponentId,
  setIsComponentTreeOpen,
  setIsComponentInspecting,
  navigateToPast,
  navigateToFuture,
  setTab,
  setVisibleProperties,
  setVisibleSlots,
  setVisibleStyles,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

export function selectActiveComponentId(state) {
  return state.workspace.activeComponentId;
}

export function selectIsComponentTreeOpen(state) {
  return !!state.workspace.isComponentTreeOpen;
}

export function selectIsComponentInspecting(state) {
  return !!state.workspace.isComponentInspecting;
}

export function selectHasPast(state) {
  return !!state.workspace.past.length;
}

export function selectHasFuture(state) {
  return !!state.workspace.future.length;
}

export function selectActivePageId(state) {
  return state.workspace.activePageId;
}

export function selectTab(state) {
  return state.workspace.tab;
}

export function selectVisibleProperties(state) {
  return state.workspace.visibleProperties;
}

export function selectVisibleSlots(state) {
  return state.workspace.visibleSlots;
}

export function selectVisibleStyles(state) {
  return state.workspace.visibleStyles;
}
