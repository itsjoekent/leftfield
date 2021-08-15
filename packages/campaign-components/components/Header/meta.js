import get from 'lodash/get';
import {
  TAG,
  COPY_PROPERTY,
  LEVEL_PROPERTY,
} from 'pkg.campaign-components/components/Header';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import { NUMBER_RANGE_TYPE, TEXT_MARKUP } from 'pkg.campaign-components/constants/property-types';
import {
  MOBILE_DEVICE,
  TABLET_DEVICE,
  DESKTOP_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import MarkupStyle, { BOTTOM_MARGIN_ATTRIBUTE } from 'pkg.campaign-components/styles/markup';
import {
  FONT_WEIGHT_ATTRIBUTE,
  FONT_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/styles/text';
import {
  getDefaultFontFamily,
  getCampaignThemeFontWeightNearest,
} from 'pkg.campaign-components/utils/campaignThemeFontSelectors';

const HeaderMeta = {
  tag: TAG,
  name: 'Header',
  version: '1',
  shortDescription: 'Add text markup',
  properties: [
    {
      id: COPY_PROPERTY,
      label: 'Copy',
      type: TEXT_MARKUP,
      inlineOnly: true,
      allowLinks: false,
      required: true,
      defaultValue: {
        [US_ENGLISH_LANG]: '',
      },
    },
    {
      id: LEVEL_PROPERTY,
      label: 'Level',
      help: 'Using the proper header ensures your site is accessible for visually impaired users and has good search engine optimization',
      type: NUMBER_RANGE_TYPE,
      min: 1,
      max: 6,
      incrementBy: 1,
      defaultValue: {
        [US_ENGLISH_LANG]: 1,
      },
    },
  ],
  styles: [
    {
      id: HEADER_STYLE,
      label: 'Text',
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
  ],
};

export default HeaderMeta;
