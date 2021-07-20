import get from 'lodash.get';
import {
  DISCLAIMER_TEXT_STYLE,
  DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE,
  GRID_STYLE,

  ENABLE_EXPRESS_DONATE_PROPERTY,
} from '@cc/components/ActBlueDonateForm/meta';
import {
  DESKTOP_DEVICE,
  TABLET_DEVICE,
} from '@cc/constants/responsive';
import BoxStyle from '@cc/styles/box';
import GridStyle, { COLUMNS_ATTRIBUTE } from '@cc/styles/grid';
import TextStyle from '@cc/styles/text';
import applyStyleIf from '@cc/utils/applyStyleIf';
import getPropertyValue from '@cc/utils/getPropertyValue';
import getStyleValue from '@cc/utils/getStyleValue';

export const DISCLAIMER_CLASS_NAME = 'actblue-form-disclaimer';

export default function ActBlueFormCSS({
  componentClassName,
  theme,
  properties,
  slots,
  styles,
  language,
}) {
  const gridStyles = get(styles, GRID_STYLE, {});
  const textDisclaimerStyles = get(styles, DISCLAIMER_TEXT_STYLE, {});

  return `
    .${componentClassName} {
      ${BoxStyle.styling({
        styles: gridStyles,
        theme,
      })}

      ${GridStyle.styling({
        styles: gridStyles,
        theme,
      })}

      ${applyStyleIf(
        getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY, language),
        `
          .${DISCLAIMER_CLASS_NAME} {
            ${TextStyle.styling({ theme, styles: textDisclaimerStyles })}

            text-align: center;
            grid-column: span ${getStyleValue(gridStyles, COLUMNS_ATTRIBUTE)};
            margin-top: ${getStyleValue(textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE)}px;

            @media (${theme.deviceBreakpoints.tabletUp}) {
              ${applyStyleIf(
                getStyleValue(gridStyles, COLUMNS_ATTRIBUTE, null, null, TABLET_DEVICE),
                (styleValue) => `grid-column: span ${styleValue};`,
              )}

              ${applyStyleIf(
                getStyleValue(textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE, null, null, TABLET_DEVICE),
                (styleValue) => `margin-top: ${styleValue}px;`,
              )}
            }

            @media (${theme.deviceBreakpoints.desktopSmallUp}) {
              ${applyStyleIf(
                getStyleValue(gridStyles, COLUMNS_ATTRIBUTE, null, null, DESKTOP_DEVICE),
                (styleValue) => `grid-column: span ${styleValue};`,
              )}

              ${applyStyleIf(
                getStyleValue(textDisclaimerStyles, DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE, null, null, DESKTOP_DEVICE),
                (styleValue) => `margin-top: ${styleValue}px;`,
              )}
            }
          }
        `,
        (value) => value === true,
      )}
    }
  `;
}
