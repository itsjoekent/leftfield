import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { hydrate } from 'react-dom';
import get from 'lodash/get';
import Builder from 'pkg.builder';
import { Components, theme } from 'pkg.campaign-components';

import 'pkg.campaign-components/css/reset.css';

try {
  const page = get(window, 'page');
  if (!page) {
    throw new Error('No page data set');
  }

  function recursiveRenderFill(componentId) {
    const component = get(page, `components.${componentId}`);
    if (!component) {
      // QUESTION: Throw error?
      return;
    }

    const tag = get(component, 'tag');

    if (!component.render) {
      page.components[componentId].render = Components[tag];
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

  hydrate(
    Builder(React.createElement, page),
    document.getElementById('root'),
  );
} catch (error) {
  console.error(error);
  // TODO: Render error, report error
}
