import get from 'lodash/get';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import { TEXT_MARKUP } from 'pkg.campaign-components/constants/property-types';
import {
  MOBILE_DEVICE,
  TABLET_DEVICE,
  DESKTOP_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import MarkupStyle, { BOTTOM_MARGIN_ATTRIBUTE } from 'pkg.campaign-components/styles/markup';
import {
  FONT_WEIGHT_ATTRIBUTE,
  FONT_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/styles/text';
import {
  getDefaultFontFamily,
  getCampaignThemeFontWeightNearest,
} from 'pkg.campaign-components/utils/campaignThemeFontSelectors';

export const TAG = 'Content';

export const COPY_PROPERTY = 'COPY_PROPERTY';

export const CONTENT_CONTAINER_STYLE = 'CONTENT_CONTAINER_STYLE';
export const PARAGRAPH_STYLE = 'PARAGRAPH_STYLE';
export const HEADER_1_STYLE = 'HEADER_1_STYLE';
export const HEADER_2_STYLE = 'HEADER_2_STYLE';
export const HEADER_3_STYLE = 'HEADER_3_STYLE';
export const HEADER_4_STYLE = 'HEADER_4_STYLE';

const ContentMeta = {
  tag: TAG,
  name: 'Content',
  shortDescription: 'Add text markup',
  properties: [
    {
      id: COPY_PROPERTY,
      label: 'Copy',
      type: TEXT_MARKUP,
      required: true,
      defaultValue: {
        [US_ENGLISH_LANG]: '',
      },
    },
  ],
  styles: [
    {
      id: PARAGRAPH_STYLE,
      label: 'Paragraphs',
      type: MarkupStyle.key,
      attributes: MarkupStyle.attributes({
        [BOTTOM_MARGIN_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 12,
            },
          },
        },
        [FONT_WEIGHT_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getCampaignThemeFontWeightNearest(
                campaignTheme,
                getDefaultFontFamily(campaignTheme),
                400,
              ),
            },
          }),
        },
      }),
    },
    {
      id: HEADER_1_STYLE,
      label: 'Header 1',
      type: MarkupStyle.key,
      attributes: MarkupStyle.attributes({
        [BOTTOM_MARGIN_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 24,
            },
          },
        },
        [FONT_SIZE_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 36,
            },
          },
        },
        [FONT_WEIGHT_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getCampaignThemeFontWeightNearest(
                campaignTheme,
                getDefaultFontFamily(campaignTheme),
                800,
              ),
            },
          }),
        },
      }),
    },
    {
      id: HEADER_2_STYLE,
      label: 'Header 2',
      type: MarkupStyle.key,
      attributes: MarkupStyle.attributes({
        [BOTTOM_MARGIN_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 18,
            },
          },
        },
        [FONT_SIZE_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 28,
            },
          },
        },
        [FONT_WEIGHT_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getCampaignThemeFontWeightNearest(
                campaignTheme,
                getDefaultFontFamily(campaignTheme),
                700,
              ),
            },
          }),
        },
      }),
    },
    {
      id: HEADER_3_STYLE,
      label: 'Header 3',
      type: MarkupStyle.key,
      attributes: MarkupStyle.attributes({
        [BOTTOM_MARGIN_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 16,
            },
          },
        },
        [FONT_SIZE_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 24,
            },
          },
        },
        [FONT_WEIGHT_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getCampaignThemeFontWeightNearest(
                campaignTheme,
                getDefaultFontFamily(campaignTheme),
                600,
              ),
            },
          }),
        },
      }),
    },
    {
      id: HEADER_4_STYLE,
      label: 'Header 4',
      type: MarkupStyle.key,
      attributes: MarkupStyle.attributes({
        [BOTTOM_MARGIN_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 12,
            },
          },
        },
        [FONT_SIZE_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 22,
            },
          },
        },
        [FONT_WEIGHT_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getCampaignThemeFontWeightNearest(
                campaignTheme,
                getDefaultFontFamily(campaignTheme),
                500,
              ),
            },
          }),
        },
      }),
    },
    {
      id: CONTENT_CONTAINER_STYLE,
      label: 'Content Container',
      attributes: [
        ...BoxStyle.attributes(),
        ...FlexStyle.attributes(),
      ],
    },
  ],
};

export default ContentMeta;
