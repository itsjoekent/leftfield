import get from 'lodash/get';
import { darken } from 'polished';
import {
  COLOR_TYPE,
  NUMBER_RANGE_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle, {
  BACKGROUND_COLOR_ATTRIBUTE,
  PADDING_HORIZONTAL_ATTRIBUTE,
  PADDING_VERTICAL_ATTRIBUTE,
} from 'pkg.campaign-components/styles/box';
import DisplayStyle from 'pkg.campaign-components/styles/display';
import TextStyle, {
  COLOR_ATTRIBUTE,
  FONT_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/styles/text';
import {
  getBrightestCampaignThemeColor,
  getReadableThemeColor,
} from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import applyStyleIf, { isStyleDefined } from 'pkg.campaign-components/utils/applyStyleIf';
import getCascadingStyleValue from 'pkg.campaign-components/utils/getCascadingStyleValue';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import getThemeValue from 'pkg.campaign-components/utils/getThemeValue';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const KEY = 'ButtonStyle';

export const HOVER_BACKGROUND_COLOR_ATTRIBUTE = 'HOVER_BACKGROUND_COLOR_ATTRIBUTE';
export const HOVER_BORDER_COLOR_ATTRIBUTE = 'HOVER_BORDER_COLOR_ATTRIBUTE';
export const HOVER_TEXT_COLOR_ATTRIBUTE = 'HOVER_TEXT_COLOR_ATTRIBUTE';
export const FOCUS_OUTLINE_COLOR_ATTRIBUTE = 'FOCUS_OUTLINE_COLOR_ATTRIBUTE';
export const FOCUS_OUTLINE_WIDTH_ATTRIBUTE = 'FOCUS_OUTLINE_WIDTH_ATTRIBUTE';

export const TRANSITION_ATTRIBUTE = 'TRANSITION_ATTRIBUTE';

const ButtonStyle = {
  key: KEY,
  humanName: 'Button Style',
  attributes: (textOverrides, boxOverrides) => ([
    ...TextStyle.attributes({
      ...(textOverrides || {}),
      [COLOR_ATTRIBUTE]: {
        dynamicDefaultThemeValue: ({ campaignTheme }) => ({
          [MOBILE_DEVICE]: {
            inheritFromTheme: getReadableThemeColor(
              campaignTheme,
              get(campaignTheme, `colors.${getBrightestCampaignThemeColor(campaignTheme)}.value`),
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
    {
      id: TRANSITION_ATTRIBUTE,
      label: 'Hover/Focus Transition',
      help: 'When the button changes on hover (or focus), this defines how long it takes to transition from one color to another',
      type: NUMBER_RANGE_TYPE,
      notResponsive: true,
      min: 0,
      max: 10,
      incrementBy: 1,
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: 4,
        },
      },
    },
    ...DisplayStyle.attributes(),
  ]),
  styling: ({ applyStyleIfChanged, theme, styles }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;

    ${DisplayStyle.styling({
      applyStyleIfChanged,
      theme,
      styles,
      defaultDisplayValue: 'inline-flex',
    })}

    ${TextStyle.styling({
      applyStyleIfChanged,
      theme,
      styles,
    })}

    ${BoxStyle.styling({
      applyStyleIfChanged,
      theme,
      styles,
    })}

    text-decoration: none;
    text-align: center;
    cursor: pointer;

    transition: all ${getStyleValue({ styles, attribute: TRANSITION_ATTRIBUTE }) / 10}s;
    transition-property: background-color, border, box-shadow, color;

    &:hover, &:active {
      ${responsiveStyleGenerator(
        applyStyleIfChanged,
        theme,
        {
          styles,
          attribute: HOVER_BACKGROUND_COLOR_ATTRIBUTE,
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
          attribute: HOVER_BORDER_COLOR_ATTRIBUTE,
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
          attribute: HOVER_TEXT_COLOR_ATTRIBUTE,
          theme,
          themePath: 'campaign.colors',
        },
        (styleValue) => `color: ${styleValue};`,
      )}
    }

    &:focus {
      ${applyStyleIf(
        getStyleValue({
          styles,
          attribute: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
          theme,
          themePath: 'campaign.colors'
        }),
        (styleValue) => `
          outline-style: solid;
          outline-color: transparent;
          box-shadow: 0 0 0 ${getStyleValue(styles, FOCUS_OUTLINE_WIDTH_ATTRIBUTE)}px ${styleValue};
        `,
      )}

      @media (${theme.deviceBreakpoints.tabletUp}) {
        ${applyStyleIf(
          getStyleValue({
            styles,
            attribute: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
            theme,
            themePath: 'campaign.colors',
            device: TABLET_DEVICE,
          }),
          (styleValue) => `
            outline-style: solid;
            outline-color: transparent;
            box-shadow: 0 0 0 ${getCascadingStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_WIDTH_ATTRIBUTE,
              devices: [TABLET_DEVICE, MOBILE_DEVICE],
            })}px ${getCascadingStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
              theme,
              themePath: 'campaign.colors',
              devices: [TABLET_DEVICE, MOBILE_DEVICE],
            })};
          `,
          (styleValue) => isStyleDefined(styleValue)
            || isStyleDefined(getStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_WIDTH_ATTRIBUTE,
              device: TABLET_DEVICE,
            })),
        )}
      }

      @media (${theme.deviceBreakpoints.desktopSmallUp}) {
        ${applyStyleIf(
          getStyleValue({
            styles,
            attribute: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
            theme,
            themePath: 'campaign.colors',
            device: DESKTOP_DEVICE,
          }),
          (styleValue) => `
            outline-style: solid;
            outline-color: transparent;
            box-shadow: 0 0 0 ${getCascadingStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_WIDTH_ATTRIBUTE,
              devices: [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE],
            })}px ${getCascadingStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_COLOR_ATTRIBUTE,
              theme,
              themePath: 'campaign.colors',
              devices: [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE],
            })};
          `,
          (styleValue) => !!styleValue
            || getStyleValue({
              styles,
              attribute: FOCUS_OUTLINE_WIDTH_ATTRIBUTE,
              device: DESKTOP_DEVICE,
            }),
        )}
      }
    }
  `,
};

export default ButtonStyle;
