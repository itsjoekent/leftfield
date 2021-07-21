import get from 'lodash/get';
import { NUMBER_RANGE_TYPE } from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import applyStyleIf from 'pkg.campaign-components/utils/applyStyleIf';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

export const KEY = 'GRID_STYLE';

export const COLUMNS_ATTRIBUTE = 'COLUMNS_ATTRIBUTE';
export const SPACING_ATTRIBUTE = 'SPACING_ATTRIBUTE';

const GridStyle = {
  key: KEY,
  attributes: (overrides) => ([
    {
      id: COLUMNS_ATTRIBUTE,
      label: 'Grid Columns',
      type: NUMBER_RANGE_TYPE,
      min: 1,
      max: 12,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 2,
        },
      },
      ...(get(overrides, COLUMNS_ATTRIBUTE, {})),
    },
    {
      id: SPACING_ATTRIBUTE,
      label: 'Grid Spacing',
      help: 'Space between the columns & rows in the grid',
      type: NUMBER_RANGE_TYPE,
      min: 0,
      max: 128,
      incrementBy: 2,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 6,
        },
      },
      ...(get(overrides, SPACING_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ styles, theme }) => `
    display: grid;
    grid-template-columns: repeat(${getStyleValue(styles, COLUMNS_ATTRIBUTE)}, 1fr);
    grid-gap: ${getStyleValue(styles, SPACING_ATTRIBUTE)}px;

    @media (${theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, COLUMNS_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `grid-template-columns: repeat(${styleValue}, 1fr);`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, SPACING_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `grid-gap: ${styleValue}px;`,
      )}
    }

    @media (${theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, COLUMNS_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `grid-template-columns: repeat(${styleValue}, 1fr);`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, SPACING_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `grid-gap: ${styleValue}px;`,
      )}
    }
  `,
};

export default GridStyle;
