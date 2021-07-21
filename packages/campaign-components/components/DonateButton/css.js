import get from 'lodash/get';
import { BUTTON_STYLE } from 'pkg.campaign-components/components/DonateButton/meta';
import ButtonStyle from 'pkg.campaign-components/styles/button';

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
