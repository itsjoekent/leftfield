import get from 'lodash/get';
import { HEADER_STYLE } from 'pkg.campaign-components/components/Header/meta';
import MarkupStyle from 'pkg.campaign-components/styles/markup';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function HeaderCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();
  const headerStyle = get(styles, HEADER_STYLE, {});

  return `
    .${componentClassName} {
      ${MarkupStyle.styling({
        applyStyleIfChanged,
        theme,
        styles: headerStyle,
      })}
    }
  `;
}
