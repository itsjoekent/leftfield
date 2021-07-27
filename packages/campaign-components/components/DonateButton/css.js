import get from 'lodash/get';
import { BUTTON_STYLE } from 'pkg.campaign-components/components/DonateButton/meta';
import ButtonStyle from 'pkg.campaign-components/styles/button';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function DonateButtonCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const buttonStyle = get(styles, BUTTON_STYLE, {});

  return `
    .${componentClassName} {
      ${ButtonStyle.styling({
        applyStyleIfChanged,
        styles: buttonStyle,
        theme,
      })}
    }
  `;
}
