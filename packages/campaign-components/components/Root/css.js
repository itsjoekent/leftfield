import get from 'lodash/get';
import { BACKGROUND_STYLE } from 'pkg.campaign-components/components/Root/meta';
import BoxStyle from 'pkg.campaign-components/styles/box';

export default function RootCSS({
  componentClassName,
  theme,
  styles,
}) {
  const backgroundStyle = get(styles, BACKGROUND_STYLE, {});

  return `
    .${componentClassName} {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh;
      position: relative;

      ${BoxStyle.styling({ theme, styles: backgroundStyle })}
    }
  `;
}
