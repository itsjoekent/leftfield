import get from 'lodash/get';
import {
  DISCLAIMER_TEXT_STYLE,
  DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE,
  GRID_STYLE,

  ENABLE_EXPRESS_DONATE_PROPERTY,
} from 'pkg.campaign-components/components/ActBlueDonateForm/meta';
import {
  DESKTOP_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle from 'pkg.campaign-components/styles/box';
import GridStyle, { COLUMNS_ATTRIBUTE } from 'pkg.campaign-components/styles/grid';
import TextStyle from 'pkg.campaign-components/styles/text';
import applyStyleIf from 'pkg.campaign-components/utils/applyStyleIf';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const DISCLAIMER_CLASS_NAME = 'actblue-form-disclaimer';

export default function ActBlueFormCSS({
  componentClassName,
  theme,
  properties,
  slots,
  styles,
  language,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const gridStyles = get(styles, GRID_STYLE, {});
  const textDisclaimerStyles = get(styles, DISCLAIMER_TEXT_STYLE, {});

  return `
    .${componentClassName} {
      width: 100%;

      ${BoxStyle.styling({
        applyStyleIfChanged,
        styles: gridStyles,
        theme,
      })}

      ${GridStyle.styling({
        applyStyleIfChanged,
        styles: gridStyles,
        theme,
      })}

      ${applyStyleIf(
        getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY, language),
        `
          .${DISCLAIMER_CLASS_NAME} {
            ${TextStyle.styling({
              applyStyleIfChanged,
              theme,
              styles: textDisclaimerStyles,
            })}

            text-align: center;

            ${responsiveStyleGenerator(
              applyStyleIfChanged,
              theme,
              {
                styles: gridStyles,
                attribute: COLUMNS_ATTRIBUTE,
              },
              (styleValue) => `grid-column: span ${styleValue};`,
            )}

            ${responsiveStyleGenerator(
              applyStyleIfChanged,
              theme,
              {
                styles: textDisclaimerStyles,
                attribute: DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE,
              },
              (styleValue) => `margin-top: ${styleValue}px;`,
            )}
          }
        `,
        (value) => value === true,
      )}
    }
  `;
}
