import { createSlice } from '@reduxjs/toolkit';

export const CONFIRM_MODAL = 'CONFIRM_MODAL';
export const ELEMENT_LIBRARY_MODAL = 'ELEMENT_LIBRARY_MODAL';
export const EXPORT_STYLE_MODAL = 'EXPORT_STYLE_MODAL';
export const WEBSITE_SELECTOR_MODAL = 'WEBSITE_SELECTOR_MODAL';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    type: null,
    props: {},
  },
  reducers: {
    setModal: (state, action) => {
      state.type = action.payload.type || null;
      state.props = action.payload.props || {};
    },
    closeModal: (state) => {
      state.type = null;
      state.props = {};
    },
  },
});

export function selectModalType(state) {
  return state.modal.type;
}

export function selectModalProps(state) {
  return state.modal.props;
}

export const { setModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;