import get from 'lodash.get';
import { BUTTON_STYLE } from '@cc/components/DonateButton/meta';
import ButtonStyle from '@cc/styles/button';

export default function DonateButtonCSS({
  componentClassName,
  theme,
  styles,
}) {
  const buttonStyle = get(styles, BUTTON_STYLE, {});

  return `
    .${componentClassName} {
      ${ButtonStyle.styling({ theme, styles: buttonStyle })}
    }
  `;
}
