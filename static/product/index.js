import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'wouter';
import { Provider as StateProvider } from 'react-redux'
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { theme, GlobalReset } from 'pkg.admin-components';
import Init from '@product/components/Init';
import store from '@product/store';

import '@product/index.css';

const Modal = React.lazy(() => import('@product/components/Modal'));
const Snacks = React.lazy(() => import('@product/components/Snacks'));

import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';
const DashboardPage = React.lazy(() => import('@product/routes/Dashboard'));

import { DASHBOARD_ACCOUNT_ROUTE } from '@product/routes/Dashboard/Account';
const DashboardAccountPage = React.lazy(() => import('@product/routes/Dashboard/Account'));

import { DASHBOARD_CREATE_WEBSITE_ROUTE } from '@product/routes/Dashboard/CreateWebsite';
const DashboardCreateWebsitePage = React.lazy(() => import('@product/routes/Dashboard/CreateWebsite'));

import { EDITOR_ROUTE } from '@product/routes/Editor';
const EditorPage = React.lazy(() => import('@product/routes/Editor'));

import { LOGIN_ROUTE } from '@product/routes/Login';
const LoginPage = React.lazy(() => import('@product/routes/Login'));

import LogoutPage, { LOGOUT_ROUTE } from '@product/routes/Logout';

import { RESET_PASSWORD_ROUTE } from '@product/routes/ResetPassword';
const ResetPasswordPage = React.lazy(() => import('@product/routes/ResetPassword'));

import { SIGNUP_ROUTE } from '@product/routes/Signup';
const SignupPage = React.lazy(() => import('@product/routes/Signup'));

ReactDOM.render(
  <React.StrictMode>
    <StateProvider store={store}>
      <StyleSheetManager disableVendorPrefixes>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalReset />
            <Init />
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path={DASHBOARD_ROUTE} component={DashboardPage} />
                <Route path={DASHBOARD_ACCOUNT_ROUTE} component={DashboardAccountPage} />
                <Route path={DASHBOARD_CREATE_WEBSITE_ROUTE} component={DashboardCreateWebsitePage} />
                <Route path={`${DASHBOARD_ROUTE}/:subpath`} component={DashboardPage} />
                <Route path={EDITOR_ROUTE} component={EditorPage} />
                <Route path={LOGIN_ROUTE} component={LoginPage} />
                <Route path={LOGOUT_ROUTE} component={LogoutPage} />
                <Route path={RESET_PASSWORD_ROUTE} component={ResetPasswordPage} />
                <Route path={SIGNUP_ROUTE} component={SignupPage} />
                <Route path="/:rest*">
                  {(params) => `404, Sorry the page ${params.rest} does not exist!`}
                </Route>
              </Switch>
            </Suspense>
            <Suspense fallback={null}>
              <Modal />
              <Snacks />
            </Suspense>
          </React.Fragment>
        </ThemeProvider>
      </StyleSheetManager>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
