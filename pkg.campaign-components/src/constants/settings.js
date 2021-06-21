import makeValidationError from '@cc/utils/makeValidationError';
import {
  US_ENGLISH_LANG,
} from '@cc/constants/languages';
import {
  SHORT_TEXT_TYPE,
  TOGGLE_TYPE,
  URL_TYPE,
} from '@cc/constants/property-types';

export const ACTBLUE_REFCODE_CARRY_ADS_SOURCE = {
  key: 'ACTBLUE_REFCODE_CARRY_ADS_SOURCE',
  field: {
    label: 'Convert source & subsource to ActBlue refcodes',
    help: 'If visitors arrive at your website with a source or subsource UTM parameter, they will be added to your ActBlue url as refcode & refcode2',
    defaultValue: false,
    type: TOGGLE_TYPE,
  },
};

export const ACTBLUE_EXPRESS_DISCLAIMER_COPY = {
  key: 'ACTBLUE_EXPRESS_DISCLAIMER_COPY',
  field: {
    label: 'ActBlue Express Disclaimer',
    help: 'You must warn donors when using 1-click donate functionality',
    translatable: true,
    type: SHORT_TEXT_TYPE,
    defaultValue: {
      [US_ENGLISH_LANG]: `If you've saved your information with ActBlue Express, your donation will go through immediately.`,
    },
  },
};

export const DEFAULT_ACTBLUE_DONATION_FORM = {
  key: 'DEFAULT_ACTBLUE_DONATION_FORM',
  field: {
    label: 'ActBlue Form',
    help: 'Eg: "https://secure.actblue.com/donate/your-donation-page"',
    type: URL_TYPE,
    translatable: true,
    customValidation: ({ input }) => {
      if (!input.startsWith('https://secure.actblue.com/donate/')) {
        return makeValidationError('Invalid ActBlue donation form. Must start with "https://secure.actblue.com/donate/"');
      }

      if (!(input.split('https://secure.actblue.com/donate/')[1] || '').length) {
        return makeValidationError('Invalid ActBlue donation form. Must point at a specific page.');
      }

      return true;
    },
  },
}

export const DEFAULT_ACTBLUE_REFCODE = {
  key: 'DEFAULT_ACTBLUE_REFCODE',
  field: {
    label: 'Default ActBlue Refcode',
    help: 'ActBlue refcodes are custom URL parameters that help you track where donations are coming from.',
    defaultValue: 'web',
    type: SHORT_TEXT_TYPE,
  },
}
