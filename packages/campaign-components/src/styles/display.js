import get from 'lodash.get';
import { css } from 'styled-components';
import { TOGGLE_TYPE } from '@cc/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from '@cc/constants/responsive';
import applyStyleIf from '@cc/utils/applyStyleIf';
import getStyleValue from '@cc/utils/getStyleValue';

export const KEY = 'DISPLAY_STYLE';

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
  styling: ({ styles, defaultDisplayValue = 'block' }) => css`
    ${applyStyleIf(
      getStyleValue(styles, DISPLAY_ATTRIBUTE),
      (styleValue) => css`display: none;`,
      (styleValue) => styleValue === false,
    )}

    @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`display: ${!!styleValue ? defaultDisplayValue : 'none'};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, TABLET_DEVICE),
        (styleValue) => css`display: ${defaultDisplayValue};`,
        (styleValue) => styleValue === true,
      )}
    }

    @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
      ${applyStyleIf(
        getStyleValue(styles, DISPLAY_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        (styleValue) => css`display: ${!!styleValue ? defaultDisplayValue : 'none'};`,
      )}
    }
  `,
};

export default DisplayStyle;
