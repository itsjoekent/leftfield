import { createSlice } from '@reduxjs/toolkit';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    focusedComponentId: null,
    activePageId: null,
    layout: [],
    pages: {},
    siteSettings: {},
  },
  reducers: {
    setActivePage: (pageId) => {

    },
    setIsEditingPageTitle: (isEditingPageTitle) => {

    },
    setIsPageDrawerOpen: (isPageDrawerOpen) => {

    },
    setIsSettingsMenuOpen: (isSettingsMenuOpen) => {

    },
    setFocusedComponent: (componentId) => {

    },
    navigateBackToLastFocusedComponent: () => {

    },
    setIsComponentTreeOpen: (isComponentTreeOpen) => {

    },
    setIsEditingFocusedComponentName: (isEditingComponentName) => {

    },
    updateFocusedComponentName: (name) => {

    },
  },
});
