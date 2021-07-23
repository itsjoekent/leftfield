import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'wouter';
import { Provider as StateProvider } from 'react-redux'
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { theme, GlobalReset } from 'pkg.admin-components';
import store from '@product/store';

import '@product/index.css';

import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';
const DashboardPage = React.lazy(() => import('@product/routes/Dashboard'));

import { EDITOR_ROUTE } from '@product/routes/Editor';
const EditorPage = React.lazy(() => import('@product/routes/Editor'));

import { LOGIN_ROUTE } from '@product/routes/Login';
const LoginPage = React.lazy(() => import('@product/routes/Login'));

import { SIGNUP_ROUTE } from '@product/routes/Signup';
const SignupPage = React.lazy(() => import('@product/routes/Signup'));

ReactDOM.render(
  <React.StrictMode>
    <StateProvider store={store}>
      <StyleSheetManager disableVendorPrefixes>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalReset />
            <Suspense fallback={<div>Loading...</div>}>
              <Route path={DASHBOARD_ROUTE} component={DashboardPage} />
              <Route path={EDITOR_ROUTE} component={EditorPage} />
              <Route path={LOGIN_ROUTE} component={LoginPage} />
              <Route path={SIGNUP_ROUTE} component={SignupPage} />
            </Suspense>
          </React.Fragment>
        </ThemeProvider>
      </StyleSheetManager>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
