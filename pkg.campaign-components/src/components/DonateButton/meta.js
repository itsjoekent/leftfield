import { US_ENGLISH_LANG } from '@cc/constants/languages';
import {
  SHORT_TEXT_TYPE,
} from '@cc/constants/property-types';
import {
  FUNDRAISING_TRAIT,
  DONATE_FORM_TRAIT,
  DONATE_BUTTON_TRAIT,
} from '@cc/constants/traits';

export const TAG = 'DonateButton';

export const AMOUNT_PROPERTY = 'AMOUNT_PROPERTY';
export const LABEL_PROPERTY = 'LABEL_PROPERTY';

const DonateButtonMeta = {
  tag: TAG,
  name: 'Donate Button',
  shortDescription: 'Send supporters to your donate forms',
  documentation: '',
  traits: [
    FUNDRAISING_TRAIT,
    DONATE_BUTTON_TRAIT,
  ],
  placementConstraints: [
    {
      include: [DONATE_FORM_TRAIT],
    },
  ],
  properties: [
    {
      id: AMOUNT_PROPERTY,
      label: 'Donate Amount',
      help: 'Numerical amount, other, or leave empty. This value is used in the donate form URL.',
      type: SHORT_TEXT_TYPE,
      defaultValue: {
        [US_ENGLISH_LANG]: '5',
      },
    },
    {
      id: LABEL_PROPERTY,
      label: 'Button Label',
      help: 'This copy is displayed inside the button',
      type: SHORT_TEXT_TYPE,
      defaultValue: {
        [US_ENGLISH_LANG]: '$5',
      },
    },
  ],
};

export default DonateButtonMeta;

    // textColor: {
    //   label: 'Button Text Color',
    //   type: COLOR_TYPE,
    //   required: true,
    //   inheritFromSetting: DEFAULT_DONATE_BUTTON_TEXT_COLOR.key,
    // },
    // textColorOnHover: {
    //   label: 'Button Text Color',
    //   type: COLOR_TYPE,
    //   required: true,
    //   inheritFromSetting: DEFAULT_DONATE_BUTTON_TEXT_COLOR_ON_HOVER.key,
    // },
    // backgroundColor: {
    //   label: 'Button Background Color',
    //   type: COLOR_TYPE,
    //   required: true,
    //   inheritFromSetting: DEFAULT_DONATE_BUTTON_BACKGROUND_COLOR.key,
    // },
    // backgroundColorOnHover: {
    //   label: 'Button Background Color',
    //   type: COLOR_TYPE,
    //   required: true,
    //   inheritFromSetting: DEFAULT_DONATE_BUTTON_BACKGROUND_COLOR_ON_HOVER.key,
    // },
    // borderColor: {
    //   label: 'Border Color',
    //   type: COLOR_TYPE,
    // },
    // borderColorOnHover
    // borderWidth

    // Should this be some common shared button configuration?
