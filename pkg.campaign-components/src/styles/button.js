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
import BoxStyle, {
  BACKGROUND_COLOR_ATTRIBUTE,
  PADDING_HORIZONTAL_ATTRIBUTE,
  PADDING_VERTICAL_ATTRIBUTE,
} from '@cc/styles/box';
import TextStyle, {
  COLOR_ATTRIBUTE,
  FONT_SIZE_ATTRIBUTE,
} from '@cc/styles/text';
import {
  getBrightestCampaignThemeColor,
  getReadableThemeColor,
} from '@cc/utils/campaignThemeColorSelectors';
import applyStyleIf from '@cc/utils/applyStyleIf';
import getStyleValue from '@cc/utils/getStyleValue';

export const KEY = 'BUTTON_STYLE';

// TODO: Hover (& focus?) styles

const ButtonStyle = {
  key: KEY,
  attributes: (textOverrides, boxOverrides) => ([
    ...TextStyle.attributes({
      ...(textOverrides || {}),
      [COLOR_ATTRIBUTE]: {
        dynamicDefaultThemeValue: ({ campaignTheme }) => ({
          [MOBILE_DEVICE]: {
            inheritFromTheme: getReadableThemeColor(
              campaignTheme,
              getBrightestCampaignThemeColor(campaignTheme),
            ),
          },
        }),
      },
      [FONT_SIZE_ATTRIBUTE]: {
        max: 48,
      },
    }),
    ...BoxStyle.attributes({
      ...(boxOverrides || {}),
      [BACKGROUND_COLOR_ATTRIBUTE]: {
        dynamicDefaultThemeValue: ({ campaignTheme }) => ({
          [MOBILE_DEVICE]: {
            inheritFromTheme: getBrightestCampaignThemeColor(campaignTheme),
          },
        }),
      },
      [PADDING_HORIZONTAL_ATTRIBUTE]: {
        max: 24,
      },
      [PADDING_VERTICAL_ATTRIBUTE]: {
        max: 24,
      },
    }),
  ]),
  styling: ({ campaignTheme, styles }) => css`
    ${TextStyle.styling({
      campaignTheme,
      styles,
    })}

    ${BoxStyle.styling({
      campaignTheme,
      styles,
    })}

    text-decoration: none;
    text-align: center;
    cursor: pointer;
  `,
};

export default ButtonStyle;
