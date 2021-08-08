import get from 'lodash/get';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import { TEXT_MARKUP } from 'pkg.campaign-components/constants/property-types';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import { CONTENT_TRAIT } from 'pkg.campaign-components/constants/traits';
import LinkStyle from 'pkg.campaign-components/styles/link';
import MarkupStyle, { BOTTOM_MARGIN_ATTRIBUTE } from 'pkg.campaign-components/styles/markup';
import { FONT_WEIGHT_ATTRIBUTE } from 'pkg.campaign-components/styles/text';
import {
  getDefaultFontFamily,
  getCampaignThemeFontWeightNearest,
} from 'pkg.campaign-components/utils/campaignThemeFontSelectors';

export const TAG = 'Paragraph';

export const COPY_PROPERTY = 'COPY_PROPERTY';

export const PARAGRAPH_STYLE = 'PARAGRAPH_STYLE';
export const PARAGRAPH_LINK_STYLE = 'PARAGRAPH_LINK_STYLE';

const ParagraphMeta = {
  tag: TAG,
  name: 'Paragraph',
  version: '1',
  shortDescription: 'Add text content',
  properties: [
    {
      id: COPY_PROPERTY,
      label: 'Copy',
      type: TEXT_MARKUP,
      inlineOnly: true,
      required: true,
      defaultValue: {
        [US_ENGLISH_LANG]: '',
      },
    },
  ],
  styles: [
    {
      id: PARAGRAPH_STYLE,
      label: 'Text',
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
      id: PARAGRAPH_LINK_STYLE,
      label: 'Link Style',
      type: LinkStyle.key,
      attributes: LinkStyle.attributes(),
    },
  ],
  traits: [
    CONTENT_TRAIT,
  ],
};

export default ParagraphMeta;
