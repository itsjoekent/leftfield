import { get } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { PARLIAMENTARIAN_ESCAPE_KEY } from '@editor/constants/parliamentarian';

export const PROPERTIES_TAB = 'PROPERTIES_TAB';
export const STYLES_TAB = 'STYLES_TAB';
export const SLOTS_TAB = 'SLOTS_TAB';
export const DOCUMENTATION_TAB = 'DOCUMENTATION_TAB';
export const FEEDBACK_TAB = 'FEEDBACK_TAB';

export const DISABLE_HISTORY = 'DISABLE_HISTORY';

function shouldLogAction(action) {
  return !get(action, `payload.${PARLIAMENTARIAN_ESCAPE_KEY}`, false)
    && !get(action, `payload.${DISABLE_HISTORY}`, false);
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    activeComponentId: '1',
    activePageId: 'test',
    tab: PROPERTIES_TAB,
    past: [],
    future: [],
    isComponentTreeOpen: false,
    isSettingsMenuOpen: false,
    visibleProperties: [],
    visibleSlots: [],
    visibleStyles: [],
  },
  reducers: {
    setTab: (state, action) => {
      const { payload: { tab } } = action;
      if (tab === state.tab) return;

      if (shouldLogAction(action)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.tab = tab;
    },
    setActivePageId: (state, action) => {
      const { payload: { pageId } } = action;
      if (pageId === state.activePageId) return;

      if (shouldLogAction(action)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.activePageId = pageId;
      state.isComponentTreeOpen = false;
    },
    setActiveComponentId: (state, action) => {
      const { payload: { componentId } } = action;
      if (componentId === state.activeComponentId) return;

      if (shouldLogAction(action)) {
        state.past.push({
          componentId: state.activeComponentId,
          pageId: state.activePageId,
          tab: state.tab,
        });

        state.future = [];
      }

      state.activeComponentId = componentId;
      state.isComponentTreeOpen = false;
    },
    setIsComponentTreeOpen: (state, action) => {
      state.isComponentTreeOpen = action.payload;
    },
    setIsSettingsMenuOpen: (state, action) => {
      state.isSettingsMenuOpen = action.payload;
    },
    navigateToPast: (state, action) => {
      const past = state.past.pop();
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
  setIsSettingsMenuOpen,
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

export function selectIsSettingsMenuOpen(state) {
  return !!state.workspace.isSettingsMenuOpen;
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
