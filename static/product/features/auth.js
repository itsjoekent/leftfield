import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';
import isDefined from '@product/utils/isDefined';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    account: null,
    organization: null,
    token: Cookies.get('lf_auth') || null,
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {
  setAccount,
  setOrganization,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;

export function selectAuthAccount(state) {
  return state.auth.account;
}

export function selectAuthOrganization(state) {
  return state.auth.organization;
}

export function selectAuthToken(state) {
  return state.auth.token;
}

export function selectIsAuthenticated(state) {
  return isDefined(selectAuthToken(state));
}
