import get from 'lodash/get';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import { getLightestCampaignThemeColor } from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'BoxStyle';

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
  styling: ({ applyStyleIfChanged, styles, theme }) => `
    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: BACKGROUND_COLOR_ATTRIBUTE,
        theme,
        themePath: 'campaign.colors',
      },
      (styleValue) => `background-color: ${styleValue};`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: BORDER_COLOR_ATTRIBUTE,
        theme,
        themePath: 'campaign.colors',
      },
      (styleValue) => `border-color: ${styleValue};`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: BORDER_WIDTH_ATTRIBUTE,
      },
      (styleValue) => `
        border-style: solid;
        border-width: ${styleValue}px;
      `,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: BORDER_RADIUS_ATTRIBUTE,
      },
      (styleValue) => `border-radius: ${styleValue}px;`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: PADDING_HORIZONTAL_ATTRIBUTE,
      },
      (styleValue) => `
        padding-left: ${styleValue}px;
        padding-right: ${styleValue}px;
      `,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: PADDING_VERTICAL_ATTRIBUTE,
      },
      (styleValue) => `
        padding-top: ${styleValue}px;
        padding-bottom: ${styleValue}px;
      `,
    )}
  `,
};

export default BoxStyle;
