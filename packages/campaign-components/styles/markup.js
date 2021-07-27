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
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'MarkupStyle';

// TODO: Redo font weight system...
// - Every font must have xyz weights defined
// - If the font doesn't have that weight, its just a duplicate value
// - Remove the dynamic complicated font weight stuff
export const BOLD_WEIGHT_ATTRIBUTE = 'BOLD_WEIGHT_ATTRIBUTE';
export const BOTTOM_MARGIN_ATTRIBUTE = 'BOTTOM_MARGIN_ATTRIBUTE';

const MarkupStyle = {
  key: KEY,
  humanName: 'Markup Style',
  attributes: (textOverrides, overrides) => ([
    ...TextStyle.attributes(textOverrides),
    {
      id: BOLD_WEIGHT_ATTRIBUTE,
      label: 'Bold Font Weight',
      type: SELECT_TYPE,
      optionsFromTheme: ({ campaignTheme, styles }) => getThemeLabels(
        campaignTheme,
        `fontWeights.${getStyleValue({ styles, attribute: FONT_FAMILY_ATTRIBUTE })}`,
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
  styling: ({ applyStyleIfChanged, styles, theme }) => `
    ${TextStyle.styling({ applyStyleIfChanged, theme, styles })}

    &:not(:last-child) {
      ${responsiveStyleGenerator(
        applyStyleIfChanged,
        theme,
        {
          styles,
          attribute: BOTTOM_MARGIN_ATTRIBUTE,
        },
        (styleValue) => `margin-bottom: ${styleValue}px;`,
      )}
    }

    strong {
      ${responsiveStyleGenerator(
        applyStyleIfChanged,
        theme,
        {
          styles,
          attribute: BOLD_WEIGHT_ATTRIBUTE,
          theme,
          themePath: `campaign.fontWeights.${getStyleValue({ styles, attribute: FONT_FAMILY_ATTRIBUTE })}`,
        },
        (styleValue) => `margin-bottom: ${styleValue}px;`,
      )}
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
