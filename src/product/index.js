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

import { EDITOR_ROUTE } from '@product/routes/Editor';
const Editor = React.lazy(() => import('@product/routes/Editor'));

ReactDOM.render(
  <React.StrictMode>
    <StateProvider store={store}>
      <StyleSheetManager disableVendorPrefixes>
        <ThemeProvider theme={theme}>
          <React.Fragment>
            <GlobalReset />
            <Suspense fallback={<div>Loading...</div>}>
              <Route path={EDITOR_ROUTE} component={Editor} />
            </Suspense>
          </React.Fragment>
        </ThemeProvider>
      </StyleSheetManager>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
