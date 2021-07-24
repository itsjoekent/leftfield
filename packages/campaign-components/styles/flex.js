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
import applyStyleIf, { notZero } from 'pkg.campaign-components/utils/applyStyleIf';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

export const KEY = 'FLEX_STYLE';

export const DIRECTION_ATTRIBUTE = 'DIRECTION_ATTRIBUTE';
export const GRID_GAP_ATTRIBUTE = 'GRID_GAP_ATTRIBUTE';
export const ALIGN_ATTRIBUTE = 'ALIGN_ATTRIBUTE';
export const JUSTIFY_ATTRIBUTE = 'JUSTIFY_ATTRIBUTE';
export const WRAP_ATTRIBUTE = 'WRAP_ATTRIBUTE';

export const VERTICAL_DIRECTION = 'column';
export const HORIZONTAL_DIRECTION = 'row';

export const START_ALIGNMENT = 'flex-start';
export const END_ALIGNMENT = 'flex-end';
export const CENTER_ALIGNMENT = 'center';
export const SPACE_BETWEEN_ALIGNMENT = 'space-between';

export const FLEX_WRAP = 'wrap';
export const FLEX_NO_WRAP = 'nowrap';

const FlexStyle = {
  key: KEY,
  attributes: (overrides) => ([
    {
      id: DIRECTION_ATTRIBUTE,
      label: 'Layout Direction',
      type: SELECT_TYPE,
      options: [
        { label: 'Vertical', value: VERTICAL_DIRECTION },
        { label: 'Horizontal', value: HORIZONTAL_DIRECTION },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: VERTICAL_DIRECTION,
        },
      },
      ...(get(overrides, DIRECTION_ATTRIBUTE, {})),
    },
    {
      id: GRID_GAP_ATTRIBUTE,
      label: 'Layout Spacing',
      help: 'Space between the components in this layout',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 128,
      incrementBy: 2,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 0,
        },
      },
      ...(get(overrides, GRID_GAP_ATTRIBUTE, {})),
    },
    {
      id: ALIGN_ATTRIBUTE,
      label: 'Component Alignment',
      help: 'Align components in this layout relative to the layout direction',
      type: SELECT_TYPE,
      options: [
        { label: 'Start of layout', value: START_ALIGNMENT },
        { label: 'End of layout', value: END_ALIGNMENT },
        { label: 'Center of layout', value: CENTER_ALIGNMENT },
        { label: 'Equal space between', value: SPACE_BETWEEN_ALIGNMENT },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: START_ALIGNMENT,
        },
      },
      ...(get(overrides, ALIGN_ATTRIBUTE, {})),
    },
    {
      id: JUSTIFY_ATTRIBUTE,
      label: 'Component Position',
      help: 'Position components in this layout relative to the layout direction',
      type: SELECT_TYPE,
      options: [
        { label: 'Start of layout', value: START_ALIGNMENT },
        { label: 'End of layout', value: END_ALIGNMENT },
        { label: 'Center of layout', value: CENTER_ALIGNMENT },
        { label: 'Equal space between', value: SPACE_BETWEEN_ALIGNMENT },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: START_ALIGNMENT,
        },
      },
      ...(get(overrides, JUSTIFY_ATTRIBUTE, {})),
    },
    {
      id: WRAP_ATTRIBUTE,
      label: 'Component Overflow',
      type: SELECT_TYPE,
      options: [
        { label: 'Don\'t wrap components', value: FLEX_NO_WRAP },
        { label: 'Wrap components', value: FLEX_WRAP },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: FLEX_NO_WRAP,
        },
      },
      ...(get(overrides, JUSTIFY_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ styles, theme }) => `
    display: flex;
    flex-direction: ${getStyleValue(styles, DIRECTION_ATTRIBUTE)};
    align-items: ${getStyleValue(styles, ALIGN_ATTRIBUTE)};
    justify-content: ${getStyleValue(styles, JUSTIFY_ATTRIBUTE)};
    flex-wrap: ${getStyleValue(styles, WRAP_ATTRIBUTE)};

    ${applyStyleIf(
      getStyleValue(styles, GRID_GAP_ATTRIBUTE),
      (styleValue) => `grid-gap: ${styleValue}px;`,
      notZero,
    )}

    @media (${theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DIRECTION_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `flex-direction: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, ALIGN_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `align-items: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, JUSTIFY_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `justify-content: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, WRAP_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `flex-wrap: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, GRID_GAP_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `grid-gap: ${styleValue}px;`,
        notZero,
      )}
    }

    @media (${theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DIRECTION_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `flex-direction: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, ALIGN_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `align-items: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, JUSTIFY_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `justify-content: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, WRAP_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `flex-wrap: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, GRID_GAP_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `grid-gap: ${styleValue}px;`,
        notZero,
      )}
    }
  `,
};

export default FlexStyle;
