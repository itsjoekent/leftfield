import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import { hydrate } from 'react-dom';
import uniq from 'lodash/uniq';
import render from '@baseballs/presentation/render';

import 'pkg.campaign-components/css/reset.css';

(async function() {
  try {
    const pageDataResponse = await fetch(window.__PAGE_DATA_URL__);
    const page = await pageDataResponse.json();

    const componentTags = uniq(
      Object.values(page.components).map((component) => component.tag)
    );

    const loadedComponents = await Promise.all(componentTags.map(async (tag) => {
      const { default: Component } = await import(
        /* webpackChunkName: "[request]" */
        /* webpackExports: "default" */
        /* webpackInclude: /index.js$/ */
        `pkg.campaign-components/components/${tag}`
      );

      return Component;
    }));

    const Components = loadedComponents.reduce((acc, Component, index) => ({
      ...acc,
      [componentTags[index]]: Component,
    }), {});

    hydrate(render(Components, page), document.getElementById('root'));
  } catch (error) {
    console.error(error);
    // TODO: Render error, report error
  }
})();
