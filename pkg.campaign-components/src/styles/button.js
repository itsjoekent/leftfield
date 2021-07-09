import get from 'lodash.get';
import { css } from 'styled-components';
import { darken } from 'polished';
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
import DisplayStyle from '@cc/styles/display';
import TextStyle, {
  COLOR_ATTRIBUTE,
  FONT_SIZE_ATTRIBUTE,
} from '@cc/styles/text';
import {
  getBrightestCampaignThemeColor,
  getReadableThemeColor,
} from '@cc/utils/campaignThemeColorSelectors';
import applyStyleIf from '@cc/utils/applyStyleIf';
import getCascadingStyleValue from '@cc/utils/getCascadingStyleValue';
import getStyleValue from '@cc/utils/getStyleValue';
import getThemeValue from '@cc/utils/getThemeValue';

export const KEY = 'BUTTON_STYLE';

export const HOVER_BACKGROUND_COLOR_ATTRIBUTE = 'HOVER_BACKGROUND_COLOR_ATTRIBUTE';
export const HOVER_BORDER_COLOR_ATTRIBUTE = 'HOVER_BORDER_COLOR_ATTRIBUTE';
export const HOVER_TEXT_COLOR_ATTRIBUTE = 'HOVER_TEXT_COLOR_ATTRIBUTE';
export const FOCUS_OUTLINE_COLOR_ATTRIBUTE = 'FOCUS_OUTLINE_COLOR_ATTRIBUTE';
export const FOCUS_OUTLINE_WIDTH_ATTRIBUTE = 'FOCUS_OUTLINE_WIDTH_ATTRIBUTE';

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
    {
      id: HOVER_BACKGROUND_COLOR_ATTRIBUTE,
      label: 'Background Color (Mouse Hover, Touch)',
      help: 'When someone puts their mouse cursor over the button, you should change the visual appearance to let them know it\'s interactable',
      type: COLOR_TYPE,
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          custom: darken(
            0.2,
            getThemeValue(
              campaignTheme,
              `colors.${getBrightestCampaignThemeColor(campaignTheme)}`,
              '#111',
            ),
          ),
        },
      }),
    },
    {
      id: HOVER_BORDER_COLOR_ATTRIBUTE,
      label: 'Border Color (Mouse Hover, Touch)',
      help: 'When someone puts their mouse cursor over the button, you should change the visual appearance to let them know it\'s interactable',
      type: COLOR_TYPE,
    },
    {
      id: HOVER_TEXT_COLOR_ATTRIBUTE,
      label: 'Text Color (Mouse Hover, Touch)',
      help: 'When someone puts their mouse cursor over the button, you should change the visual appearance to let them know it\'s interactable',
      type: COLOR_TYPE,
    },
    {
      id: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
      label: 'Outline Color (Keyboard Focus)',
      help: 'When someone is navigating your website with a keyboard, you should visually indicate what element they are focused on',
      type: COLOR_TYPE,
      dynamicDefaultThemeValue: ({ campaignTheme }) => ({
        [MOBILE_DEVICE]: {
          custom: darken(
            0.4,
            getThemeValue(
              campaignTheme,
              `colors.${getBrightestCampaignThemeColor(campaignTheme)}`,
              '#111',
            ),
          ),
        },
      }),
    },
    {
      id: FOCUS_OUTLINE_WIDTH_ATTRIBUTE,
      label: 'Outline Width (Keyboard Focus)',
      type: NUMBER_RANGE_TYPE,
      min: 1,
      max: 4,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 2,
        },
      },
    },
    // TODO: Hover transition
    ...DisplayStyle.attributes(),
  ]),
  styling: ({ campaignTheme, styles }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    ${DisplayStyle.styling({
      campaignTheme,
      styles,
      defaultDisplayValue: 'inline-flex',
    })}

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

    &:hover, &:active {
      ${applyStyleIf(
        getStyleValue(styles, HOVER_BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
        (styleValue) => css`background-color: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, HOVER_BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
        (styleValue) => css`border-color: ${styleValue};`,
      )}

      ${applyStyleIf(
        getStyleValue(styles, HOVER_TEXT_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
        (styleValue) => css`color: ${styleValue};`,
      )}

      @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
        ${applyStyleIf(
          getStyleValue(styles, HOVER_BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
          (styleValue) => css`background-color: ${styleValue};`,
        )}

        ${applyStyleIf(
          getStyleValue(styles, HOVER_BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
          (styleValue) => css`border-color: ${styleValue};`,
        )}

        ${applyStyleIf(
          getStyleValue(styles, HOVER_TEXT_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
          (styleValue) => css`color: ${styleValue};`,
        )}
      }

      @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
        ${applyStyleIf(
          getStyleValue(styles, HOVER_BACKGROUND_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
          (styleValue) => css`background-color: ${styleValue};`,
        )}

        ${applyStyleIf(
          getStyleValue(styles, HOVER_BORDER_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
          (styleValue) => css`border-color: ${styleValue};`,
        )}

        ${applyStyleIf(
          getStyleValue(styles, HOVER_TEXT_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
          (styleValue) => css`color: ${styleValue};`,
        )}
      }
    }

    &:focus {
      ${applyStyleIf(
        getStyleValue(styles, FOCUS_OUTLINE_COLOR_ATTRIBUTE, campaignTheme, 'colors'),
        (styleValue) => css`
          outline-style: solid;
          outline-color: transparent;
          box-shadow: 0 0 0 ${getStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE)}px ${styleValue};
        `,
      )}

      @media (${(props) => props.theme.deviceBreakpoints.tabletUp}) {
        ${applyStyleIf(
          getStyleValue(styles, FOCUS_OUTLINE_COLOR_ATTRIBUTE, campaignTheme, 'colors', TABLET_DEVICE),
          (styleValue) => css`
            outline-style: solid;
            outline-color: transparent;
            box-shadow: 0 0 0
              ${getCascadingStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE, null, null, [TABLET_DEVICE, MOBILE_DEVICE])}px
              ${getCascadingStyleValue(styles, FOCUS_OUTLINE_COLOR_ATTRIBUTE, campaignTheme, 'colors', [TABLET_DEVICE, MOBILE_DEVICE])};
          `,
          (styleValue) => !!styleValue
            || getStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE, null, null, TABLET_DEVICE),
        )}
      }

      @media (${(props) => props.theme.deviceBreakpoints.desktopSmallUp}) {
        ${applyStyleIf(
          getStyleValue(styles, FOCUS_OUTLINE_COLOR_ATTRIBUTE, campaignTheme, 'colors', DESKTOP_DEVICE),
          (styleValue) => css`
            outline-style: solid;
            outline-color: transparent;
            box-shadow: 0 0 0
              ${getCascadingStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE, null, null, [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE])}px
              ${getCascadingStyleValue(styles, FOCUS_OUTLINE_COLOR_ATTRIBUTE, campaignTheme, 'colors', [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE])};
          `,
          (styleValue) => !!styleValue
            || getStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE, null, null, DESKTOP_DEVICE),
        )}
      }
    }
  `,
};

export default ButtonStyle;
