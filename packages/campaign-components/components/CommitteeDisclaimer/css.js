import get from 'lodash/get';
import {
  DISCLAIMER_BOX_STYLE,
  DISCLAIMER_TEXT_STYLE,
} from 'pkg.campaign-components/components/CommitteeDisclaimer';
import {
  DESKTOP_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle from 'pkg.campaign-components/styles/box';
import TextStyle from 'pkg.campaign-components/styles/text';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export default function CommitteeDisclaimerCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const boxDisclaimerStyles = get(styles, DISCLAIMER_BOX_STYLE, {});
  const textDisclaimerStyles = get(styles, DISCLAIMER_TEXT_STYLE, {});

  return `
    .${componentClassName} {
      width: fit-content;
      text-align: center;

      ${BoxStyle.styling({
        applyStyleIfChanged,
        styles: boxDisclaimerStyles,
        theme,
      })}

      span {
        ${TextStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: textDisclaimerStyles,
        })}

        text-transform: uppercase;
      }
    }
  `;
}
