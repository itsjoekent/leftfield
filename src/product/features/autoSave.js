import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latestRevision: null,
  lastUpdated: null,
  revisionHash: null,
};

export const autoSaveSlice = createSlice({
  name: 'autoSave',
  initialState,
  reducers: {
    clear: (state) => {
      state.latestRevision = initialState.latestRevision;
      state.lastUpdated = initialState.lastUpdated;
    },
    pushRevision: (state, action) => {
      state.latestRevision = action.payload.data;
      state.lastUpdated = Date.now();
      state.revisionHash = action.payload.hash;
    },
  },
});

export const {
  clear,
  pushRevision,
} = autoSaveSlice.actions;

export default autoSaveSlice.reducer;

export function selectAutoSave(state) {
  return state.autoSave;
}

export function selectAutoSaveHash(state) {
  return state.autoSave.revisionHash;
}
