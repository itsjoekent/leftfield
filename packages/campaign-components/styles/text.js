import get from 'lodash/get';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
  SELECT_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import { getDarkestCampaignThemeColor } from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import getThemeLabels from 'pkg.campaign-components/utils/getThemeLabels';
import getThemeValue from 'pkg.campaign-components/utils/getThemeValue';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';
import { MAIN_FONT_FAMILY } from 'pkg.campaign-components/theme';

export const KEY = 'TextStyle';

export const COLOR_ATTRIBUTE = 'COLOR_ATTRIBUTE';
export const FONT_FAMILY_ATTRIBUTE = 'FONT_FAMILY_ATTRIBUTE';
export const FONT_SIZE_ATTRIBUTE = 'FONT_SIZE_ATTRIBUTE';
export const FONT_WEIGHT_ATTRIBUTE = 'FONT_WEIGHT_ATTRIBUTE';
export const LETTER_SPACING_ATTRIBUTE = 'LETTER_SPACING_ATTRIBUTE';
export const LINE_HEIGHT_ATTRIBUTE = 'LINE_HEIGHT_ATTRIBUTE';

const TextStyle = {
  key: KEY,
  humanName: 'Text Style',
  attributes: (overrides) => ([
    {
      id: COLOR_ATTRIBUTE,
      label: 'Text Color',
      type: COLOR_TYPE,
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          inheritFromTheme: getDarkestCampaignThemeColor(campaignTheme),
        },
      }),
      ...(get(overrides, COLOR_ATTRIBUTE, {})),
    },
    {
      id: FONT_SIZE_ATTRIBUTE,
      label: 'Font size',
      type: NUMBER_RANGE_TYPE,
      min: 10,
      max: 128,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 18,
        },
      },
      ...(get(overrides, FONT_SIZE_ATTRIBUTE, {})),
    },
    {
      id: FONT_FAMILY_ATTRIBUTE,
      label: 'Font Family',
      type: SELECT_TYPE,
      optionsFromTheme: ({ campaignTheme }) => getThemeLabels(campaignTheme, 'fonts'),
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          inheritFromTheme: Object.keys(get(campaignTheme, 'fonts', {}))[0],
        },
      }),
      notResponsive: true,
      ...(get(overrides, FONT_FAMILY_ATTRIBUTE, {})),
    },
    {
      id: FONT_WEIGHT_ATTRIBUTE,
      label: 'Font Weight',
      type: SELECT_TYPE,
      optionsFromTheme: ({ campaignTheme, styles }) => getThemeLabels(
        campaignTheme,
        `fontWeights.${getStyleValue({ styles, attribute: FONT_FAMILY_ATTRIBUTE })}`,
      ),
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          inheritFromTheme: Object.keys(
            get(
              campaignTheme,
              `fontWeights.${Object.keys(get(campaignTheme, 'fonts', {}))[0]}`,
              {},
            )
          )[0],
        },
      }),
      ...(get(overrides, FONT_WEIGHT_ATTRIBUTE, {})),
    },
    {
      id: LETTER_SPACING_ATTRIBUTE,
      label: 'Letter Spacing',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 10,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, LETTER_SPACING_ATTRIBUTE, {})),
    },
    {
      id: LINE_HEIGHT_ATTRIBUTE,
      label: 'Line Height',
      type: NUMBER_RANGE_TYPE,
      min: 0.8,
      max: 3,
      incrementBy: 0.1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 1.2,
        },
      },
      ...(get(overrides, LINE_HEIGHT_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ applyStyleIfChanged, theme, styles }) => `
    font-family: ${getStyleValue({
      styles,
      attribute: FONT_FAMILY_ATTRIBUTE,
      theme,
      themePath: 'campaign.fonts'
    })};

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: FONT_SIZE_ATTRIBUTE,
      },
      (styleValue) => `font-size: ${styleValue}px;`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: FONT_WEIGHT_ATTRIBUTE,
        theme,
        themePath: `campaign.fontWeights.${getStyleValue({ styles, attribute: FONT_FAMILY_ATTRIBUTE })}`,
      },
      (styleValue) => `font-weight: ${styleValue};`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: LETTER_SPACING_ATTRIBUTE,
      },
      (styleValue) => `letter-spacing: ${styleValue}px;`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: LINE_HEIGHT_ATTRIBUTE,
      },
      (styleValue) => `line-height: ${styleValue};`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: COLOR_ATTRIBUTE,
        theme,
        themePath: 'campaign.colors',
      },
      (styleValue) => `color: ${styleValue};`,
    )}
  `,
};

export default TextStyle;
