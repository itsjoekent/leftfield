import get from 'lodash/get';
import {
  SELECT_TYPE,
  NUMBER_RANGE_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import TextStyle, { FONT_FAMILY_ATTRIBUTE } from 'pkg.campaign-components/styles/text';
import applyStyleIf, { notZero } from 'pkg.campaign-components/utils/applyStyleIf';
import {
  getDefaultFontFamily,
  getCampaignThemeFontWeightNearest,
} from 'pkg.campaign-components/utils/campaignThemeFontSelectors';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import getThemeLabels from 'pkg.campaign-components/utils/getThemeLabels';

export const KEY = 'MarkupStyle';

// TODO: Redo font weight system...
// - Every font must have xyz weights defined
// - If the font doesn't have that weight, its just a duplicate value
// - Remove the dynamic complicated font weight stuff
export const BOLD_WEIGHT_ATTRIBUTE = 'BOLD_WEIGHT_ATTRIBUTE';
export const BOTTOM_MARGIN_ATTRIBUTE = 'BOTTOM_MARGIN_ATTRIBUTE';

const MarkupStyle = {
  key: KEY,
  attributes: (textOverrides, overrides) => ([
    ...TextStyle.attributes(textOverrides),
    {
      id: BOLD_WEIGHT_ATTRIBUTE,
      label: 'Bold Font Weight',
      type: SELECT_TYPE,
      optionsFromTheme: ({ campaignTheme, styles }) => getThemeLabels(
        campaignTheme,
        `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
      ),
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          inheritFromTheme: getCampaignThemeFontWeightNearest(
            campaignTheme,
            getDefaultFontFamily(campaignTheme),
            700,
            -1,
          ),
        },
      }),
      ...(get(overrides, BOLD_WEIGHT_ATTRIBUTE, {})),
    },
    {
      id: BOTTOM_MARGIN_ATTRIBUTE,
      label: 'Bottom margin',
      help: 'Space to add below this element',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 120,
      incrementBy: 2,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 12,
        },
      },
      ...(get(overrides, BOTTOM_MARGIN_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ styles, theme }) => `
    ${TextStyle.styling({ theme, styles })}

    &:not(:last-child) {
      ${applyStyleIf(
        getStyleValue(styles, BOTTOM_MARGIN_ATTRIBUTE),
        (styleValue) => `margin-bottom: ${styleValue}px;`,
        notZero,
      )}

      @media (${theme.deviceBreakpoints.tabletUp}) {
        ${applyStyleIf(
          getStyleValue(styles, BOTTOM_MARGIN_ATTRIBUTE, null, null, TABLET_DEVICE),
          (styleValue) => `margin-bottom: ${styleValue}px;`,
          notZero,
        )}
      }

      @media (${theme.deviceBreakpoints.desktopSmallUp}) {
        ${applyStyleIf(
          getStyleValue(styles, BOTTOM_MARGIN_ATTRIBUTE, null, null, DESKTOP_DEVICE),
          (styleValue) => `margin-bottom: ${styleValue}px;`,
          notZero,
        )}
      }      
    }

    strong {
      font-weight: ${getStyleValue(
        styles,
        BOLD_WEIGHT_ATTRIBUTE,
        theme.campaign,
        `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
      )};

      @media (${theme.deviceBreakpoints.tabletUp}) {
        ${applyStyleIf(
          getStyleValue(
            styles,
            BOLD_WEIGHT_ATTRIBUTE,
            theme.campaign,
            `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
            TABLET_DEVICE,
          ),
          (styleValue) => `font-weight: ${styleValue};`,
        )}
      }

      @media (${theme.deviceBreakpoints.desktopSmallUp}) {
        ${applyStyleIf(
          getStyleValue(
            styles,
            BOLD_WEIGHT_ATTRIBUTE,
            theme.campaign,
            `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
            DESKTOP_DEVICE,
          ),
          (styleValue) => `font-weight: ${styleValue};`,
        )}
      }
    }

    em {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }
  `,
};

export default MarkupStyle;
