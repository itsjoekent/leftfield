import get from 'lodash.get';
import { css } from 'styled-components';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
  SELECT_TYPE,
} from '@cc/constants/property-types';
import {
  MOBILE_DEVICE,
  DESKTOP_DEVICE,
} from '@cc/constants/responsive';
import getStyleValue from '@cc/utils/getStyleValue';

export const KEY = 'SIMPLE_LAYOUT_STYLE';

export const BACKGROUND_COLOR_ATTRIBUTE = 'BACKGROUND_COLOR_ATTRIBUTE';
export const DIRECTION_ATTRIBUTE = 'DIRECTION_ATTRIBUTE';

const SimpleLayoutStyle = {
  key: KEY,
  attributes: [
    {
      id: DIRECTION_ATTRIBUTE,
      label: 'Grid Direction',
      type: CHECKLIST_TYPE,
      options: ['']
    },
    {
      id: BACKGROUND_COLOR_ATTRIBUTE,
      label: 'Background Color',
      type: COLOR_TYPE,
      defaultThemeValue: ({ theme }) => ({
        [MOBILE_DEVICE]: Object.keys(get(theme, 'campaign.colors', {}))[0],
        [DESKTOP_DEVICE]: Object.keys(get(theme, 'campaign.colors', {}))[0],
      }),
    },
  ],
  styling: ({ theme, styles }) => css`
    background-color: ${get(theme, `campaign.colors.${getStyleValue(styles, BACKGROUND_COLOR_ATTRIBUTE, MOBILE_DEVICE)}`)};

    @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
      background-color: ${get(theme, `campaign.colors.${getStyleValue(styles, BACKGROUND_COLOR_ATTRIBUTE, DESKTOP_DEVICE, MOBILE_DEVICE)}`)};
    }
  `,
};

export default SimpleLayoutStyle;
