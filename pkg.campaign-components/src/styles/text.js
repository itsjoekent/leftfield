import get from 'lodash.get';
import { css } from 'styled-components';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
  SELECT_TYPE,
} from '@cc/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from '@cc/constants/responsive';
import applyStyleIf from '@cc/utils/applyStyleIf';
import { getDarkestCampaignThemeColor } from '@cc/utils/campaignThemeColorSelectors';
import getStyleValue from '@cc/utils/getStyleValue';
import getThemeLabels from '@cc/utils/getThemeLabels';
import getThemeValue from '@cc/utils/getThemeValue';
import { MAIN_FONT_FAMILY } from '@cc/theme';

export const KEY = 'TEXT_STYLE';

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
      id: FONT_SIZE_ATTRIBUTE,
      label: 'Font size',
      type: NUMBER_RANGE_TYPE,
      min: 10,
      max: 120,
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
  ]),
  styling: ({ campaignTheme, styles }) => css`
    font-family: ${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE, campaignTheme, 'fonts')};
    font-size: ${getStyleValue(styles, FONT_SIZE_ATTRIBUTE)}px;
    font-weight: ${getStyleValue(
      styles,
      FONT_WEIGHT_ATTRIBUTE,
      campaignTheme,
      `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
    )};
    letter-spacing: ${getStyleValue(styles, LETTER_SPACING_ATTRIBUTE)}px;
    color: ${getStyleValue(styles, COLOR_ATTRIBUTE, campaignTheme, 'colors')};

    @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, FONT_SIZE_ATTRIBUTE, TABLET_DEVICE),
        (styleValue) => css`font-size: ${styleValue}px;`,
      )}
      ${applyStyleIf(
        getStyleValue(
          styles,
          FONT_WEIGHT_ATTRIBUTE,
          campaignTheme,
          `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
          TABLET_DEVICE,
        ),
        (styleValue) => css`font-weight: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LETTER_SPACING_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`letter-spacing: ${styleValue}px;`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
        (styleValue) => css`color: ${styleValue};`,
      )}
    }

    @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, FONT_SIZE_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`font-size: ${styleValue}px;`,
      )}
      ${applyStyleIf(
        getStyleValue(
          styles,
          FONT_WEIGHT_ATTRIBUTE,
          campaignTheme,
          `fontWeights.${getStyleValue(styles, FONT_FAMILY_ATTRIBUTE)}`,
          DESKTOP_DEVICE,
        ),
        (styleValue) => css`font-weight: ${styleValue};`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, LETTER_SPACING_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`letter-spacing: ${styleValue}px;`,
      )}
      ${applyStyleIf(
        getStyleValue(styles, COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
        (styleValue) => css`color: ${styleValue};`,
      )}
    }
  `,
};

export default TextStyle;
