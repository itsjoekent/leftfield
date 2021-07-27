import get from 'lodash/get';
import { NUMBER_RANGE_TYPE } from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'GridStyle';

export const COLUMNS_ATTRIBUTE = 'COLUMNS_ATTRIBUTE';
export const SPACING_ATTRIBUTE = 'SPACING_ATTRIBUTE';

const GridStyle = {
  key: KEY,
  humanName: 'Grid Style',
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
  styling: ({ applyStyleIfChanged, styles, theme }) => `
    display: grid;

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: COLUMNS_ATTRIBUTE,
      },
      (styleValue) => `grid-template-columns: repeat(${styleValue}, 1fr);`,
    )}

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      {
        styles,
        attribute: SPACING_ATTRIBUTE,
      },
      (styleValue) => `grid-gap: ${styleValue}px;`,
    )}
  `,
};

export default GridStyle;
