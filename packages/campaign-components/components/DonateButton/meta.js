import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import {
  SHORT_TEXT_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  FUNDRAISING_TRAIT,
  DONATE_FORM_TRAIT,
  DONATE_BUTTON_TRAIT,
} from 'pkg.campaign-components/constants/traits';
import ButtonStyle from 'pkg.campaign-components/styles/button';

export const TAG = 'DonateButton';

export const AMOUNT_PROPERTY = 'AMOUNT_PROPERTY';
export const LABEL_PROPERTY = 'LABEL_PROPERTY';

export const BUTTON_STYLE = 'BUTTON_STYLE';

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
      help: 'Numerical amount, other, or leave empty. This value is used in the donate form URL to pre-select a button on the donation page.',
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
      required: true,
      defaultValue: {
        [US_ENGLISH_LANG]: '$5',
      },
    },
  ],
  styles: [
    {
      id: BUTTON_STYLE,
      label: 'Button Text Style',
      type: ButtonStyle.key,
      attributes: ButtonStyle.attributes(),
    },
  ],
};

export default DonateButtonMeta;
