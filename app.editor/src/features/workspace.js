import { createSlice } from '@reduxjs/toolkit';

export const PROPERTIES_TAB = 'PROPERTIES_TAB';
export const SLOTS_TAB = 'SLOTS_TAB';
export const DOCUMENTATION_TAB = 'DOCUMENTATION_TAB';
export const FEEDBACK_TAB = 'FEEDBACK_TAB';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    activeComponentId: '1',
    activePageId: 'test',
    tab: PROPERTIES_TAB,
    visibleProperties: [],
    visibleSlots: [],
  },
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
    setActivePageId: (state, action) => {
      state.activePageId = action.payload;
    },
    setActiveComponentId: (state, action) => {
      state.activeComponentId = action.payload;
    },
    setVisibleProperties: (state, action) => {
      state.visibleProperties = action.payload.visibleProperties;
    },
    setVisibleSlots: (state, action) => {
      state.visibleSlots = action.payload.visibleSlots;
    },
    // setIsPageDrawerOpen: (isPageDrawerOpen) => {
    //
    // },
    // setIsSettingsMenuOpen: (isSettingsMenuOpen) => {
    //
    // },
    // setActiveComponentId: (componentId) => {
    //
    // },
    // navigateBackToLastActiveComponent: () => {
    //
    // },
    // setIsComponentTreeOpen: (isComponentTreeOpen) => {
    //
    // },
  },
});

export const {
  setActivePageId,
  setActiveComponentId,
  setTab,
  setVisibleProperties,
  setVisibleSlots,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;

export function selectActiveComponentId(state) {
  return state.workspace.activeComponentId;
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
