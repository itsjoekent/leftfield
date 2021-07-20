import get from 'lodash.get';
import { BACKGROUND_STYLE } from '@cc/components/Root/meta';
import BoxStyle from '@cc/styles/box';

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

      ${BoxStyle.styling({ theme, styles: backgroundStyle })}
    }
  `;
}
