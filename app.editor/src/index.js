import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StateProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components';
import { theme, GlobalReset } from 'pkg.admin-components';
import store from '@editor/store';
import Entrypoint from '@editor/components/Entrypoint';
import { PARLIAMENTARIAN_BOOTSTRAP_TYPE } from '@editor/constants/parliamentarian';
import '@editor/index.css';

store.dispatch({ type: PARLIAMENTARIAN_BOOTSTRAP_TYPE });

ReactDOM.render(
  <React.StrictMode>
    <StateProvider store={store}>
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <GlobalReset />
          <Entrypoint />
        </React.Fragment>
      </ThemeProvider>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
