import path from 'path';
import { get } from 'lodash';
import { renderToString } from 'react-dom/server';
import {
  Components,
  ComponentCss,
  Languages,
  compileComponentStyles,
  theme,
} from 'pkg.campaign-components';
import render from '@baseballs/presentation/render';
import compileAssembly from '@product/utils/compileAssembly';

export default function ssr(state, route) {  
  const page = compileAssembly(state, route);
  const html = renderToString(render(Components, page));

  const components = Object.keys(get(page, 'components', {}));
  const componentsCss = components.reduce((acc, componentId) => {
    const component = get(page, `components.${componentId}`);
    const tag = get(component, 'tag');

    const cssGenerator = ComponentCss[tag];

    if (!!cssGenerator) {
      const css = cssGenerator({
        componentClassName: `c-${componentId}`,
        theme: {
          ...theme,
          ...get(state, 'assembly.theme', {}),
        },
        properties: component.properties,
        slots: component.slots,
        styles: component.styles,
        language: Languages.US_ENGLISH_LANG,
      });

      return `${acc}\n${css}`;
    }

    return acc;
  }, '');

  const css = compileComponentStyles(componentsCss);

  return { css, html, page };
}
