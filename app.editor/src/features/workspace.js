import { createSlice } from '@reduxjs/toolkit';

export const PROPERTIES_TAB = 'PROPERTIES_TAB';
export const STYLES_TAB = 'STYLES_TAB';
export const SLOTS_TAB = 'SLOTS_TAB';
export const DOCUMENTATION_TAB = 'DOCUMENTATION_TAB';
export const FEEDBACK_TAB = 'FEEDBACK_TAB';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    activeComponentId: '1',
    pastActiveComponents: [],
    futureActiveComponents: [],
    isComponentTreeOpen: false,
    isComponentInspecting: false,
    activePageId: 'test',
    tab: PROPERTIES_TAB,
    visibleProperties: [],
    visibleSlots: [],
    visibleStyles: [],
  },
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
    setActivePageId: (state, action) => {
      state.activePageId = action.payload;
    },
    setActiveComponentId: (state, action) => {
      if (state.activeComponentId === action.payload) {
        return;
      }

      state.pastActiveComponents.push(state.activeComponentId);
      state.activeComponentId = action.payload;
      state.futureActiveComponents = [];
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
    navigateToPastComponent: (state, action) => {
      const past = state.pastActiveComponents.pop();
      state.futureActiveComponents.push(state.activeComponentId);
      state.activeComponentId = past;
    },
    navigateToFutureComponent: (state, action) => {
      const next = state.futureActiveComponents.pop();
      state.pastActiveComponents.push(state.activeComponentId);
      state.activeComponentId = next;
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
  navigateToPastComponent,
  navigateToFutureComponent,
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

export function selectHasPastComponents(state) {
  return !!state.workspace.pastActiveComponents.length;
}

export function selectHasFutureComponents(state) {
  return !!state.workspace.futureActiveComponents.length;
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
