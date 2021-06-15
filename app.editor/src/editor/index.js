import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StateProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components';
import { theme, GlobalReset } from 'pkg.admin-components';
import store from '@editor/store';
import Entrypoint from '@editor/components/Entrypoint';
import '@editor/index.css';

export default function renderEditor() {
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
}
