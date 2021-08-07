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
import { getLightestCampaignThemeColor } from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'BoxStyle';

export const BACKGROUND_COLOR_ATTRIBUTE = 'BACKGROUND_COLOR_ATTRIBUTE';
export const BORDER_COLOR_ATTRIBUTE = 'BORDER_COLOR_ATTRIBUTE';
export const BORDER_WIDTH_ATTRIBUTE = 'BORDER_WIDTH_ATTRIBUTE';
export const BORDER_RADIUS_ATTRIBUTE = 'BORDER_RADIUS_ATTRIBUTE';
export const BOX_SHADOW_ENABLE_ATTRIBUTE = 'BOX_SHADOW_ENABLE_ATTRIBUTE';
export const BOX_SHADOW_X_ATTRIBUTE = 'BOX_SHADOW_X_ATTRIBUTE';
export const BOX_SHADOW_Y_ATTRIBUTE = 'BOX_SHADOW_Y_ATTRIBUTE';
export const BOX_SHADOW_BLUR_RADIUS_ATTRIBUTE = 'BOX_SHADOW_BLUR_RADIUS_ATTRIBUTE';
export const BOX_SHADOW_SPREAD_RADIUS_ATTRIBUTE = 'BOX_SHADOW_SPREAD_RADIUS_ATTRIBUTE';
export const BOX_SHADOW_COLOR_ATTRIBUTE = 'BOX_SHADOW_COLOR_ATTRIBUTE';
export const MAX_WIDTH_SIZE_ATTRIBUTE = 'MAX_WIDTH_SIZE_ATTRIBUTE';
export const MAX_WIDTH_UNIT_ATTRIBUTE = 'MAX_WIDTH_UNIT_ATTRIBUTE';
export const PADDING_HORIZONTAL_ATTRIBUTE = 'PADDING_HORIZONTAL_ATTRIBUTE';
export const PADDING_VERTICAL_ATTRIBUTE = 'PADDING_VERTICAL_ATTRIBUTE';

export const BOX_SHADOW_ENABLE = 'BOX_SHADOW_ENABLE';
export const BOX_SHADOW_DISABLE = 'BOX_SHADOW_DISABLE';

export const MAX_WIDTH_PIXELS = 'px';
export const MAX_WIDTH_PERCENT = '%';
export const MAX_WIDTH_SCREEN_WIDTH = 'vw';
export const MAX_WIDTH_DISABLED = 'MAX_WIDTH_DISABLED';

const BoxStyle = {
  key: KEY,
  humanName: 'Box Style',
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
      id: BOX_SHADOW_ENABLE_ATTRIBUTE,
      label: 'Toggle Box Shadow',
      type: SELECT_TYPE,
      options: [
        { label: 'Enabled', value: BOX_SHADOW_ENABLE },
        { label: 'Disabled', value: BOX_SHADOW_DISABLE },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: BOX_SHADOW_DISABLE,
        },
      },
      ...(get(overrides, BOX_SHADOW_ENABLE_ATTRIBUTE, {})),
    },
    {
      id: BOX_SHADOW_X_ATTRIBUTE,
      label: 'Box Shadow Horizontal Offset',
      hideIf: {
        compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', BOX_SHADOW_DISABLE) === BOX_SHADOW_DISABLE,
      },
      type: NUMBER_RANGE_TYPE,
      min: -64,
      max: 64,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BOX_SHADOW_X_ATTRIBUTE, {})),
    },
    {
      id: BOX_SHADOW_Y_ATTRIBUTE,
      label: 'Box Shadow Vertical Offset',
      type: NUMBER_RANGE_TYPE,
      hideIf: {
        compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', BOX_SHADOW_DISABLE) === BOX_SHADOW_DISABLE,
      },
      min: -64,
      max: 64,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BOX_SHADOW_X_ATTRIBUTE, {})),
    },
    {
      id: BOX_SHADOW_BLUR_RADIUS_ATTRIBUTE,
      label: 'Box Shadow Blur Radius',
      help: 'The larger the value, the bigger and lighter the shadow becomes',
      type: NUMBER_RANGE_TYPE,
      hideIf: {
        compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', BOX_SHADOW_DISABLE) === BOX_SHADOW_DISABLE,
      },
      min: 0,
      max: 24,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BOX_SHADOW_BLUR_RADIUS_ATTRIBUTE, {})),
    },
    {
      id: BOX_SHADOW_SPREAD_RADIUS_ATTRIBUTE,
      label: 'Box Shadow Spread Radius',
      help: 'Scale the size of the shadow',
      type: NUMBER_RANGE_TYPE,
      hideIf: {
        compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', BOX_SHADOW_DISABLE) === BOX_SHADOW_DISABLE,
      },
      min: -64,
      max: 64,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, BOX_SHADOW_SPREAD_RADIUS_ATTRIBUTE, {})),
    },
    {
      id: BOX_SHADOW_COLOR_ATTRIBUTE,
      label: 'Box Shadow Color',
      type: COLOR_TYPE,
      hideIf: {
        compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', BOX_SHADOW_DISABLE) === BOX_SHADOW_DISABLE,
      },
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 'rgba(0, 0, 0, 0.25)',
        },
      },
      ...(get(overrides, BOX_SHADOW_COLOR_ATTRIBUTE, {})),
    },
    {
      id: MAX_WIDTH_SIZE_ATTRIBUTE,
      label: 'Max Width',
      help: 'Prevent this container from growing past a certain width',
      type: NUMBER_RANGE_TYPE,
      hideIf: {
        compare: MAX_WIDTH_UNIT_ATTRIBUTE,
        test: (attribute) => get(attribute, 'custom', MAX_WIDTH_DISABLED) === MAX_WIDTH_DISABLED,
      },
      min: 1,
      max: 1440,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 1,
        },
      },
      ...(get(overrides, MAX_WIDTH_SIZE_ATTRIBUTE, {})),
    },
    {
      id: MAX_WIDTH_UNIT_ATTRIBUTE,
      label: 'Max Width Unit',
      help: 'Use a fixed pixel width, a relative percent width, or disable the max width attribute',
      type: SELECT_TYPE,
      options: [
        { label: 'Pixels', value: MAX_WIDTH_PIXELS },
        { label: 'Percent of parent component', value: MAX_WIDTH_PERCENT },
        { label: 'Percent of screen width', value: MAX_WIDTH_SCREEN_WIDTH },
        { label: 'Disabled', value: MAX_WIDTH_DISABLED },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: MAX_WIDTH_DISABLED,
        },
      },
      ...(get(overrides, MAX_WIDTH_UNIT_ATTRIBUTE, {})),
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
      [
        {
          styles,
          attribute: BOX_SHADOW_ENABLE_ATTRIBUTE,
        },
        {
          styles,
          attribute: BOX_SHADOW_X_ATTRIBUTE,
        },
        {
          styles,
          attribute: BOX_SHADOW_Y_ATTRIBUTE,
        },
        {
          styles,
          attribute: BOX_SHADOW_BLUR_RADIUS_ATTRIBUTE,
        },
        {
          styles,
          attribute: BOX_SHADOW_SPREAD_RADIUS_ATTRIBUTE,
        },
        {
          styles,
          attribute: BOX_SHADOW_COLOR_ATTRIBUTE,
          theme,
          themePath: 'campaign.colors',
        },
      ],
      (styleValue) => {
        if (styleValue[0] === BOX_SHADOW_DISABLE) {
          return 'box-shadow: none;';
        }

        return `box-shadow: ${styleValue[1]}px ${styleValue[2]}px ${styleValue[3]}px ${styleValue[4]}px ${styleValue[5]};`
      },
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      [
        {
          styles,
          attribute: MAX_WIDTH_SIZE_ATTRIBUTE,
        },
        {
          styles,
          attribute: MAX_WIDTH_UNIT_ATTRIBUTE,
        },
      ],
      (styleValue) => {
        if (styleValue[1] === MAX_WIDTH_DISABLED) {
          return 'max-width: none;';
        }

        return `max-width: ${styleValue[0]}${styleValue[1]};`
      },
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
