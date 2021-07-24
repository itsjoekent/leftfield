import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { render } from 'react-dom';
import get from 'lodash/get';
import md5 from 'md5';
import Builder from 'pkg.builder';
import {
  Components,
  ComponentCss,
  Languages,
  compileComponentStyles,
  theme,
} from 'pkg.campaign-components';

import 'pkg.campaign-components/css/reset.css';

const cssCache = {};

function ComponentWrapper({ children }) {
  const componentClassName = children.props.componentClassName;

  React.useEffect(() => {
    const elements = document.getElementsByClassName(componentClassName);
    if (!elements.length) return;

    const [element] = elements;

    function handleClick(event) {
      event.stopPropagation();
      event.preventDefault();

      const componentId = componentClassName.replace('c-', '');
      window.parent.postMessage({ type: 'CLICKED', componentId }, '*');
    }

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [componentClassName]);

  return children;
}

window.addEventListener('message', (event) => {
  // TODO: this should be the renderer url env ?
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

      const finalTheme = {
        ...theme,
        campaign: campaignTheme,
      };

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

        const cssGenerator = ComponentCss[tag]
        if (!!cssGenerator) {
          const css = cssGenerator({
            componentClassName: `c-${componentId}`,
            theme: finalTheme,
            properties: component.properties,
            slots: component.slots,
            styles: component.styles,
            language: Languages.US_ENGLISH_LANG,
          });

          const minifiedCss = compileComponentStyles(css);
          const hash = md5(minifiedCss);

          if (cssCache[componentId] !== hash) {
            cssCache[componentId] = hash;

            const element = document.querySelector(`[data-componentstyle="${componentId}"]`);

            if (!!element) {
              element.replaceChildren(document.createTextNode(minifiedCss));
            } else {
              document.head.insertAdjacentHTML('beforeend', `<style data-componentstyle="${componentId}">${minifiedCss}</style>`);
            }
          }
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

      render(
        Builder(React.createElement, page, ComponentWrapper),
        document.getElementById('root'),
      );
    } catch (error) {
      console.error(error);
    }
  }
});

window.parent.postMessage({ type: 'READY' }, '*');
