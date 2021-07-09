import get from 'lodash.get';
import { css } from 'styled-components';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
} from '@cc/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from '@cc/constants/responsive';
import { getLightestCampaignThemeColor } from '@cc/utils/campaignThemeColorSelectors';
import applyStyleIf, { notZero } from '@cc/utils/applyStyleIf';
import getStyleValue from '@cc/utils/getStyleValue';

export const KEY = 'BOX_STYLE';

export const BACKGROUND_COLOR_ATTRIBUTE = 'BACKGROUND_COLOR_ATTRIBUTE';
export const BORDER_COLOR_ATTRIBUTE = 'BORDER_COLOR_ATTRIBUTE';
export const BORDER_WIDTH_ATTRIBUTE = 'BORDER_WIDTH_ATTRIBUTE';
export const BORDER_RADIUS_ATTRIBUTE = 'BORDER_RADIUS_ATTRIBUTE';
export const PADDING_HORIZONTAL_ATTRIBUTE = 'PADDING_HORIZONTAL_ATTRIBUTE';
export const PADDING_VERTICAL_ATTRIBUTE = 'PADDING_VERTICAL_ATTRIBUTE';
// TODO: Shadow

const BoxStyle = {
  key: KEY,
  attributes: (overrides) => ([
    {
      id: BACKGROUND_COLOR_ATTRIBUTE,
      label: 'Background Color',
      type: COLOR_TYPE,
      ...(get(overrides, BACKGROUND_COLOR_ATTRIBUTE, {})),
    },
    {
      id: BORDER_COLOR_ATTRIBUTE,
      label: 'Border Color',
      type: COLOR_TYPE,
      ...(get(overrides, BORDER_COLOR_ATTRIBUTE, {})),
    },
    {
      id: BORDER_WIDTH_ATTRIBUTE,
      label: 'Border Width',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 6,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BORDER_WIDTH_ATTRIBUTE, {})),
    },
    {
      id: BORDER_RADIUS_ATTRIBUTE,
      label: 'Border Radius',
      help: 'Round the corners of this component',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 24,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BORDER_RADIUS_ATTRIBUTE, {})),
    },
    {
      id: PADDING_HORIZONTAL_ATTRIBUTE,
      label: 'Horizontal Spacing',
      help: 'Adds blank space to the left & right sides of this component',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 128,
      incrementBy: 2,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, PADDING_HORIZONTAL_ATTRIBUTE, {})),
    },
    {
      id: PADDING_VERTICAL_ATTRIBUTE,
      label: 'Vertical Spacing',
      help: 'Adds blank space to the top & bottom sides of this component',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 128,
      incrementBy: 2,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, PADDING_VERTICAL_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ campaignTheme, styles }) => css`
    ${applyStyleIf(
      getStyleValue(styles, BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
      (styleValue) => css`background-color: ${styleValue};`,
    )}

    ${applyStyleIf(
      getStyleValue(styles, BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
      (styleValue) => css`border-color: ${styleValue};`,
    )}

    ${applyStyleIf(
      getStyleValue(styles, BORDER_WIDTH_ATTRIBUTE),
      (styleValue) => css`
        border-style: solid;
        border-width: ${styleValue}px;
      `,
      notZero,
    )}

    ${applyStyleIf(
      getStyleValue(styles, BORDER_RADIUS_ATTRIBUTE),
      (styleValue) => css`border-radius: ${styleValue}px;`,
      notZero,
    )}

    ${applyStyleIf(
      getStyleValue(styles, PADDING_HORIZONTAL_ATTRIBUTE),
      (styleValue) => css`
        padding-left: ${styleValue}px;
        padding-right: ${styleValue}px;
      `,
      notZero,
    )}

    ${applyStyleIf(
      getStyleValue(styles, PADDING_VERTICAL_ATTRIBUTE),
      (styleValue) => css`
        padding-top: ${styleValue}px;
        padding-bottom: ${styleValue}px;
      `,
      notZero,
    )}

    @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
        (styleValue) => css`background-color: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
        (styleValue) => css`border-color: ${styleValue};`,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_WIDTH_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`
          border-style: solid;
          border-width: ${styleValue}px;
        `,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_RADIUS_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`border-radius: ${styleValue}px;`,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, PADDING_HORIZONTAL_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`
          padding-left: ${styleValue}px;
          padding-right: ${styleValue}px;
        `,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, PADDING_VERTICAL_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`
          padding-top: ${styleValue}px;
          padding-bottom: ${styleValue}px;
        `,
        notZero,
      )}
    }

    @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
        (styleValue) => css`background-color: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
        (styleValue) => css`border-color: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_WIDTH_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`
          border-style: solid;
          border-width: ${styleValue}px;
        `,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, BORDER_RADIUS_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`border-radius: ${styleValue}px;`,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, PADDING_HORIZONTAL_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`
          padding-left: ${styleValue}px;
          padding-right: ${styleValue}px;
        `,
        notZero,
      )}

      ${applyStyleIf(
        getStyleValue(styles, PADDING_VERTICAL_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`
          padding-top: ${styleValue}px;
          padding-bottom: ${styleValue}px;
        `,
        notZero,
      )}
    }
  `,
};

export default BoxStyle;
