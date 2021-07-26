import get from 'lodash/get';
import { TOGGLE_TYPE } from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import applyStyleIf from 'pkg.campaign-components/utils/applyStyleIf';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';

export const KEY = 'DisplayStyle';

export const DISPLAY_ATTRIBUTE = 'DISPLAY_ATTRIBUTE';

const DisplayStyle = {
  key: KEY,
  attributes: (overrides) => ([
    {
      id: DISPLAY_ATTRIBUTE,
      label: 'Display',
      help: 'Toggle whether this component will be visible on different screen sizes',
      type: TOGGLE_TYPE,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: true,
        },
      },
      ...(get(overrides, DISPLAY_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ theme, styles, defaultDisplayValue = 'block' }) => `
    ${applyStyleIf(
      getStyleValue(styles, DISPLAY_ATTRIBUTE),
      (styleValue) => `display: none;`,
      (styleValue) => styleValue === false,
    )}

    @media (${theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `display: ${!!styleValue ? defaultDisplayValue : 'none'};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => `display: ${defaultDisplayValue};`,
        (styleValue) => styleValue === true,
      )}
    }

    @media (${theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => `display: ${!!styleValue ? defaultDisplayValue : 'none'};`,
      )}
    }
  `,
};

export default DisplayStyle;
