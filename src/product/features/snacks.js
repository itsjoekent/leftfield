import { v4 as uuid } from 'uuid';
import { find, findIndex } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

export const SPICY_SNACK = 'SPICY_SNACK';

export const snacksSlice = createSlice({
  name: 'snacks',
  initialState: {
    items: [],
  },
  reducers: {
    pushSnack: (state, action) => {
      state.items.push({
        ...action.payload,
        id: uuid(),
        createdAt: Date.now(),
      });
    },
    eatSnack: (state, action) => {
      const index = findIndex(state.items, { id: action.payload });
      state.items.splice(index, 1);
    },
  },
});

export const {
  pushSnack,
  eatSnack,
} = snacksSlice.actions;

export default snacksSlice.reducer;

export function selectSnacks(state) {
  return state.snacks.items;
}

export function selectSnack(id) {
  function _selectSnack(state) {
    return find(selectSnacks(state), { id });
  }

  return _selectSnack;
}
