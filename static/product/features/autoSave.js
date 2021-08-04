import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latestRevision: null,
  lastUpdated: null,
  revisionHash: null,
  revisionDescription: [],
};

export const autoSaveSlice = createSlice({
  name: 'autoSave',
  initialState,
  reducers: {
    clear: (state) => {
      state.latestRevision = initialState.latestRevision;
      state.lastUpdated = initialState.lastUpdated;
      state.revisionHash = initialState.revisionHash;
      state.revisionDescription = initialState.revisionDescription;
    },
    pushRevision: (state, action) => {
      state.latestRevision = action.payload.data;
      state.lastUpdated = Date.now();
      state.revisionHash = action.payload.hash;

      if (!state.revisionDescription.includes(action.payload.description)) {
        state.revisionDescription.push(action.payload.description);
      }
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
