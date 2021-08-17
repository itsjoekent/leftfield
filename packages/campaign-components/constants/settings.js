import makeValidationError from 'pkg.campaign-components/utils/makeValidationError';
import {
  US_ENGLISH_LANG,
  MX_SPANISH_LANG,
  labels as languageLabels,
} from 'pkg.campaign-components/constants/languages';
import {
  SELECT_TYPE,
  SHORT_TEXT_TYPE,
  TOGGLE_TYPE,
  UPLOAD_TYPE,
  URL_TYPE,
} from 'pkg.campaign-components/constants/property-types';

export const ACTBLUE_REFCODE_CARRY_ADS_SOURCE = {
  key: 'ACTBLUE_REFCODE_CARRY_ADS_SOURCE',
  field: {
    label: 'Convert source & subsource to ActBlue refcodes',
    help: 'If visitors arrive at your website with a source or subsource UTM parameter, they will be added to your ActBlue url as refcode & refcode2',
    defaultValue: {
      [US_ENGLISH_LANG]: false,
    },
    type: TOGGLE_TYPE,
  },
};

export const ACTBLUE_EXPRESS_DISCLAIMER_COPY = {
  key: 'ACTBLUE_EXPRESS_DISCLAIMER_COPY',
  field: {
    label: 'ActBlue Express Disclaimer',
    help: 'You must warn donors when using 1-click donate functionality',
    isTranslatable: true,
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
    isTranslatable: true,
    defaultValue: {
      [US_ENGLISH_LANG]: 'https://secure.actblue.com/donate/your-donation-page',
    },
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
    defaultValue: {
      [US_ENGLISH_LANG]: 'web',
    },
    type: SHORT_TEXT_TYPE,
  },
}

export const LANGUAGES = {
  key: 'LANGUAGES',
  field: {
    label: 'Languages',
    defaultValue: {
      [US_ENGLISH_LANG]: [US_ENGLISH_LANG],
    },
    type: SELECT_TYPE,
    options: [
      { value: US_ENGLISH_LANG, label: languageLabels[US_ENGLISH_LANG] },
      { value: MX_SPANISH_LANG, label: languageLabels[MX_SPANISH_LANG] },
    ],
  },
};

export const META_DESCRIPTION = {
  key: 'META_DESCRIPTION',
  field: {
    label: 'Meta Description',
    help: 'Shows under title in social media preview cards',
    isTranslatable: true,
    defaultValue: {
      [US_ENGLISH_LANG]: '',
    },
    type: SHORT_TEXT_TYPE,
  },
};

export const META_IMAGE = {
  key: 'META_IMAGE',
  field: {
    label: 'Meta Image',
    help: 'Upload the highest resolution image you have, Leftfield will automatically crop and compress',
    isTranslatable: true,
    type: UPLOAD_TYPE,
    allow: [
      'image/avif',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  },
};

export const META_TITLE = {
  key: 'META_TITLE',
  field: {
    label: 'Meta Title',
    help: 'Shows in social media preview cards',
    isTranslatable: true,
    defaultValue: {
      [US_ENGLISH_LANG]: '',
    },
    type: SHORT_TEXT_TYPE,
  },
};

export const PAID_FOR_BY_COMMITTEE = {
  key: 'PAID_FOR_BY_COMMITTEE',
  field: {
    label: 'Paid for by committee',
    help: 'FEC mandated disclaimer on any public communication made by a political committee',
    isTranslatable: true,
    defaultValue: {
      [US_ENGLISH_LANG]: 'Paid for by {your committee name}',
    },
    type: SHORT_TEXT_TYPE,
  },
};

function appendSetting(setting) {
  return { ...setting.field, id: setting.key };
}

export const SiteSettings = [
  appendSetting(ACTBLUE_REFCODE_CARRY_ADS_SOURCE),
  appendSetting(ACTBLUE_EXPRESS_DISCLAIMER_COPY),
  appendSetting(DEFAULT_ACTBLUE_DONATION_FORM),
  appendSetting(DEFAULT_ACTBLUE_REFCODE),
  appendSetting(LANGUAGES),
  appendSetting(META_IMAGE),
  appendSetting(META_TITLE),
  appendSetting(META_DESCRIPTION),
  appendSetting(PAID_FOR_BY_COMMITTEE),
];

export const PageSettings = [
  appendSetting(ACTBLUE_REFCODE_CARRY_ADS_SOURCE),
  appendSetting(ACTBLUE_EXPRESS_DISCLAIMER_COPY),
  appendSetting(DEFAULT_ACTBLUE_DONATION_FORM),
  appendSetting(DEFAULT_ACTBLUE_REFCODE),
  appendSetting(META_IMAGE),
  appendSetting(META_TITLE),
  appendSetting(META_DESCRIPTION),
];
