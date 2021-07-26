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
import applyStyleIf, { notZero } from 'pkg.campaign-components/utils/applyStyleIf';
import { getDarkestCampaignThemeColor } from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import getThemeLabels from 'pkg.campaign-components/utils/getThemeLabels';
import getThemeValue from 'pkg.campaign-components/utils/getThemeValue';
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
        `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
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
  styling: ({ theme, styles }) => `
    font-family: ${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE, theme.campaign, 'fonts')};
    font-size: ${getStyleValue(styles, FONT_SIZE_ATTRIBUTE)}px;
    font-weight: ${getStyleValue(
      styles,
      FONT_WEIGHT_ATTRIBUTE,
      theme.campaign,
      `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
    )};
    letter-spacing: ${getStyleValue(styles, LETTER_SPACING_ATTRIBUTE)}px;
    line-height: ${getStyleValue(styles, LINE_HEIGHT_ATTRIBUTE)};
    color: ${getStyleValue(styles, COLOR_ATTRIBUTE, theme.campaign, 'colors')};

    @media (${theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, FONT_SIZE_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `font-size: ${styleValue}px;`,
        notZero,
      )}
      ${applyStyleIf(
        getStyleValue(
          styles,
          FONT_WEIGHT_ATTRIBUTE,
          theme.campaign,
          `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
          TABLET_DEVICE,
        ),
        (styleValue) => `font-weight: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LETTER_SPACING_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `letter-spacing: ${styleValue}px;`,
        notZero,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LINE_HEIGHT_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `line-height: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, COLOR_ATTRIBUTE, theme.campaign, 'colors', TABLET_DEVICE),
        (styleValue) => `color: ${styleValue};`,
      )}
    }

    @media (${theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, FONT_SIZE_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `font-size: ${styleValue}px;`,
        notZero,
      )}
      ${applyStyleIf(
        getStyleValue(
          styles,
          FONT_WEIGHT_ATTRIBUTE,
          theme.campaign,
          `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
          DESKTOP_DEVICE,
        ),
        (styleValue) => `font-weight: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LETTER_SPACING_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `letter-spacing: ${styleValue}px;`,
        notZero,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LINE_HEIGHT_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `line-height: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, COLOR_ATTRIBUTE, theme.campaign, 'colors', DESKTOP_DEVICE),
        (styleValue) => `color: ${styleValue};`,
      )}
    }
  `,
};

export default TextStyle;
