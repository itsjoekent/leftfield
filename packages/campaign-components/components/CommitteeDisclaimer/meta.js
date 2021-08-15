import get from 'lodash/get';
import {
  TAG,
  COPY_PROPERTY,
  DISCLAIMER_BOX_STYLE,
  DISCLAIMER_TEXT_STYLE,
} from 'pkg.campaign-components/components/CommitteeDisclaimer';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import { PAID_FOR_BY_COMMITTEE } from 'pkg.campaign-components/constants/settings';
import BoxStyle, {
  BORDER_WIDTH_ATTRIBUTE,
  BORDER_COLOR_ATTRIBUTE,
  PADDING_HORIZONTAL_ATTRIBUTE,
  PADDING_VERTICAL_ATTRIBUTE,
} from 'pkg.campaign-components/styles/box';
import TextStyle, {
  FONT_SIZE_ATTRIBUTE,
  FONT_WEIGHT_ATTRIBUTE,
} from 'pkg.campaign-components/styles/text';
import { getDarkestCampaignThemeColor } from 'pkg.campaign-components/utils/campaignThemeColorSelectors';
import {
  getDefaultFontFamily,
  getCampaignThemeFontWeightNearest,
} from 'pkg.campaign-components/utils/campaignThemeFontSelectors';

const CommitteeDisclaimerMeta = {
  tag: TAG,
  name: 'Committee Disclaimer',
  shortDescription: 'FEC mandated disclaimer',
  version: '1',
  properties: [
    {
      ...PAID_FOR_BY_COMMITTEE.field,
      id: COPY_PROPERTY,
      inheritFromSetting: PAID_FOR_BY_COMMITTEE.key,
      required: true,
    },
  ],
  styles: [
    {
      id: DISCLAIMER_TEXT_STYLE,
      label: 'Legal Text',
      type: TextStyle.key,
      attributes: TextStyle.attributes({
        [FONT_SIZE_ATTRIBUTE]: {
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
                100,
              ),
            },
          }),
        },
      }),
    },
    {
      id: DISCLAIMER_BOX_STYLE,
      label: 'Disclaimer Box',
      attributes: BoxStyle.attributes({
        [BORDER_COLOR_ATTRIBUTE]: {
          dynamicDefaultThemeValue: ({ campaignTheme }) => ({
            [MOBILE_DEVICE]: {
              inheritFromTheme: getDarkestCampaignThemeColor(campaignTheme),
            },
          }),
        },
        [BORDER_WIDTH_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 1,
            },
          },
        },
        [PADDING_HORIZONTAL_ATTRIBUTE]: {
          max: 6,
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 6,
            },
          },
        },
        [PADDING_VERTICAL_ATTRIBUTE]: {
          max: 6,
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 2,
            },
          },
        },
      }),
    },
  ],
};

export default CommitteeDisclaimerMeta;
