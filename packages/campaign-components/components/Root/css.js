import get from 'lodash/get';
import { BACKGROUND_STYLE } from 'pkg.campaign-components/components/Root';
import BoxStyle from 'pkg.campaign-components/styles/box';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function RootCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();
  const backgroundStyle = get(styles, BACKGROUND_STYLE, {});

  return `
    .${componentClassName} {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh;
      position: relative;

      ${BoxStyle.styling({
        applyStyleIfChanged,
        styles: backgroundStyle,
        theme,
      })}
    }
  `;
}
