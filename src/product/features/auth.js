import { createSlice } from '@reduxjs/toolkit';
import isDefined from '@product/utils/isDefined';

// https://stackoverflow.com/a/25490531
const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getCookieValue('lf_auth') || null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const {
  setToken,
} = authSlice.actions;

export default authSlice.reducer;

export function selectAuthToken(state) {
  return state.auth.token;
}

export function selectIsAuthenticated(state) {
  return isDefined(selectAuthToken(state));
}
