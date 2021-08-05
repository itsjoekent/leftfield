import get from 'lodash/get';
import { CONTENT_CONTAINER_STYLE } from 'pkg.campaign-components/components/ContentContainer/meta';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function ContentContainerCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();
  const contentContainerStyle = get(styles, CONTENT_CONTAINER_STYLE, {});

  return `
    .${componentClassName} {
      width: 100%;

      ${BoxStyle.styling({
        applyStyleIfChanged,
        styles: contentContainerStyle,
        theme,
      })}

      ${FlexStyle.styling({
        applyStyleIfChanged,
        styles: contentContainerStyle,
        theme,
      })}
    }
  `;
}
