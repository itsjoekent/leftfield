import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import get from 'lodash.get';
import Builder from 'pkg.builder';
import {
  Components,
  GlobalReset,
  theme,
} from 'pkg.campaign-components';

window.addEventListener('message', (event) => {
  // if (event.origin !== "http://example.org:8080") {
  //   return;
  // }

  const {
    data,
    origin,
    source,
  } = event;

  if (get(data, 'type') === 'RENDER') {
    try {
      const page = get(data, 'payload.page');
      if (!page) {
        return;
      }

      const campaignTheme = get(data, 'payload.campaignTheme');
      if (!campaignTheme) {
        return;
      }

      function recursiveRenderFill(componentId) {
        const component = get(page, `components.${componentId}`);
        if (!component) {
          // QUESTION: Throw error?
          return;
        }

        if (!component.render) {
          page.components[componentId].render = Components[component.tag];
        }

        if (Object.keys(get(component, 'slots', {})).length) {
          Object.keys(component.slots).forEach((slotId) =>
            component.slots[slotId].forEach((childComponentId) =>
              recursiveRenderFill(childComponentId)
            )
          );
        }
      }

      recursiveRenderFill(get(page, 'rootComponentId'));

      const finalTheme = {
        ...theme,
        campaign: campaignTheme,
      };

      render((
        <ThemeProvider theme={finalTheme}>
          <GlobalReset />
          {Builder(React.createElement, page)}
        </ThemeProvider>
      ), document.getElementById('root'));
    } catch (error) {
      console.error(error);
    }
  }
});

window.parent.postMessage({ type: 'READY' }, '*');
