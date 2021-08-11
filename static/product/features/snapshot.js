import get from 'lodash';
import md5 from 'md5';
import { createSlice } from '@reduxjs/toolkit';

const initialUpdateState = {
  data: null,
  lastUpdated: null,
  hash: null,
  description: [],
};

const initialState = {
  update: initialUpdateState,
  snapshotId: '',
};

export const snapshotSlice = createSlice({
  name: 'snapshot',
  initialState,
  reducers: {
    clearUpdates: (state) => {
      state.update = initialUpdateState;
    },
    pushUpdate: (state, action) => {
      const {
        payload: {
          data,
          description,
        },
      } = action;

      const stringified = JSON.stringify(data);
      const hash = md5(stringified);

      if (state.update.hash !== hash) {
        state.update.data = stringified;
        state.update.lastUpdated = Date.now();
        state.update.hash = hash;

        if (!state.update.description.includes(description)) {
          state.update.description.push(description);
        }
      }
    },
    setSnapshotId: (state, action) => {
      state.snapshotId = action.payload;
    },
  },
});

export const {
  clearUpdates,
  pushUpdate,
  setSnapshotId,
} = snapshotSlice.actions;

export default snapshotSlice.reducer;

export function selectSnapshot(state) {
  return state.snapshot;
}

export function selectSnapshotUpdate(state) {
  return selectSnapshot(state).update;
}

export function selectSnapshotUpdateHash(target) {
  function _selectSnapshotUpdateHash(state) {
    return get(selectSnapshot(state), `${target}.hash`, initialUpdateState.hash);
  }

  return _selectSnapshotUpdateHash;
}
