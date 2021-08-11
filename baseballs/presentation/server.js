import { renderToString } from 'react-dom/server';
import {
  Components,
  ComponentCss,
  compileComponentStyles,
} from 'pkg.campaign-components';
import render from './render';

export default function server(page) {
  const html = renderToString(render(Components, page));

  const components = Object.keys(get(page, 'components', {}));
  const componentsCss = components.reduce((acc, componentId) => {
    const component = get(page, `components.${componentId}`);
    const tag = get(component, 'tag');

    const cssGenerator = ComponentCss[tag];

    if (!!cssGenerator) {
      const css = cssGenerator({
        componentClassName: `c-${componentId}`,
        theme: finalTheme,
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

  return {
    html,
    css,
  }
}
