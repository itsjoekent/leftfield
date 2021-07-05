import get from 'lodash.get';
import documentation from '@cc/components/ActBlueDonateForm/docs.md';
import makeValidationError from '@cc/utils/makeValidationError';
import {
  COLOR_TYPE,
  CHECKLIST_TYPE,
  TOGGLE_TYPE,
} from '@cc/constants/property-types';
import { US_ENGLISH_LANG } from '@cc/constants/languages';
import {
  FILLS_CONTAINER_WIDE,
  FITS_CONTENT,
  FULL_SCREEN_WIDTH,
  GROWS_VERTICALLY,
} from '@cc/constants/layout';
import {
  FUNDRAISING_TRAIT,
  ACTBLUE_TRAIT,
  DONATE_FORM_TRAIT,
  DONATE_BUTTON_TRAIT,
  OPEN_GRID_TRAIT,
} from '@cc/constants/traits';
import {
  ACTBLUE_REFCODE_CARRY_ADS_SOURCE,
  ACTBLUE_EXPRESS_DISCLAIMER_COPY,
  DEFAULT_ACTBLUE_DONATION_FORM,
  DEFAULT_ACTBLUE_REFCODE,
} from '@cc/constants/settings';

export const TAG = 'ActBlueDonateForm';

export const ONE_BUTTON_LAYOUT = {
  key: 'ONE_BUTTON_LAYOUT',
  label: 'One Button',
};

export const WIDE_LAYOUT = {
  key: 'WIDE_LAYOUT',
  label: 'Wide single row',
};

export const TWO_COLUMN_LAYOUT = {
  key: 'TWO_COLUMN_LAYOUT',
  label: 'Two Columns',
};

export const THREE_COLUMN_LAYOUT = {
  key: 'THREE_COLUMN_LAYOUT',
  label: 'Three columns',
};

export const FOUR_COLUMN_LAYOUT = {
  key: 'FOUR_COLUMN_LAYOUT',
  label: 'Four columns',
};

export const LAYOUT_PROPERTY = 'LAYOUT_PROPERTY';
export const ACTBLUE_FORM_PROPERTY = 'ACTBLUE_FORM_PROPERTY';
export const ENABLE_EXPRESS_DONATE_PROPERTY = 'ENABLE_EXPRESS_DONATE_PROPERTY';
export const EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY = 'EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY';
export const EXPRESS_DONATE_TEXT_COLOR_PROPERTY = 'EXPRESS_DONATE_TEXT_COLOR_PROPERTY';
export const REFCODE_PROPERTY = 'REFCODE_PROPERTY';
export const CARRY_TRACKING_SOURCE_PROPERTY = 'CARRY_TRACKING_SOURCE_PROPERTY';

export const DONATE_BUTTON_SLOT = 'DONATE_BUTTON_SLOT';
export const DONATE_BUTTONS_SLOT = 'DONATE_BUTTONS_SLOT';
export const WIDE_MOBILE_DONATE_BUTTONS_SLOT = 'WIDE_MOBILE_DONATE_BUTTONS_SLOT';
export const WIDE_DESKTOP_DONATE_BUTTONS_SLOT = 'WIDE_DESKTOP_DONATE_BUTTONS_SLOT';

const ActBlueDonateFormMeta = {
  tag: TAG,
  name: 'ActBlue Donate Form',
  shortDescription: 'Container for ActBlue donate button(s)',
  documentation,
  traits: [
    FUNDRAISING_TRAIT,
    ACTBLUE_TRAIT,
    DONATE_FORM_TRAIT,
  ],
  placementConstraints: [
    {
      include: [OPEN_GRID_TRAIT],
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`) !== ONE_BUTTON_LAYOUT.key,
    },
  ],
  slots: [
    {
      id: DONATE_BUTTONS_SLOT,
      label: 'Donate Buttons',
      required: true,
      isList: true,
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`) !== ONE_BUTTON_LAYOUT.key,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
      customValidation: ({ properties, children }) => {
        const layout = get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`);

        if (
          [TWO_COLUMN_LAYOUT.key, THREE_COLUMN_LAYOUT.key].includes(layout)
          && children.length !== 6
        ) {
          return makeValidationError('Must have 6 buttons');
        }

        if (
          layout === FOUR_COLUMN_LAYOUT.key
          && children.length !== 8
        ) {
          return makeValidationError('Must have 8 buttons');
        }

        return true;
      },
    },
    {
      id: DONATE_BUTTON_SLOT,
      label: 'Donate Button',
      required: true,
      isList: false,
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`) === ONE_BUTTON_LAYOUT.key,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FITS_CONTENT]: true,
      },
    },
    {
      id: WIDE_MOBILE_DONATE_BUTTONS_SLOT,
      label: 'Wide Layout Mobile Buttons',
      help: 'These buttons only render on mobile devices',
      isList: true,
      required: true,
      min: 1,
      max: 4,
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`) === WIDE_LAYOUT.key,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: false,
      },
    },
    {
      id: WIDE_DESKTOP_DONATE_BUTTONS_SLOT,
      label: 'Wide Layout Desktop Buttons',
      help: 'These buttons only render on large devices',
      required: true,
      isList: true,
      min: 1,
      max: 8,
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`) === WIDE_LAYOUT.key,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: false,
      },
    },
  ],
  properties: [
    {
      id: LAYOUT_PROPERTY,
      label: 'Form Layout',
      type: CHECKLIST_TYPE,
      required: true,
      dynamicOptions: ({ slot }) => {
        if (get(slot, `layout.${FULL_SCREEN_WIDTH}`)) {
          return [ONE_BUTTON_LAYOUT, WIDE_LAYOUT];
        }

        return [
          ONE_BUTTON_LAYOUT,
          TWO_COLUMN_LAYOUT,
          THREE_COLUMN_LAYOUT,
          FOUR_COLUMN_LAYOUT,
        ];
      },
      dynamicDefaultValue: ({ slot }) => {
        if (get(slot, `layout.${FULL_SCREEN_WIDTH}`)) {
          return {
            [US_ENGLISH_LANG]: WIDE_LAYOUT.key,
          };
        }

        return {
          [US_ENGLISH_LANG]: TWO_COLUMN_LAYOUT.key,
        };
      },
    },
    {
      ...DEFAULT_ACTBLUE_DONATION_FORM.field,
      id: ACTBLUE_FORM_PROPERTY,
      inheritFromSetting: DEFAULT_ACTBLUE_DONATION_FORM.key,
      required: true,
    },
    {
      id: ENABLE_EXPRESS_DONATE_PROPERTY,
      label: 'Enable ActBlue Express',
      help: 'This will make donations 1-click for donors with card details saved to ActBlue, a small disclaimer will be added below your donation buttons',
      type: TOGGLE_TYPE,
      defaultValue: {
        [US_ENGLISH_LANG]: false,
      },
      conditional: ({ properties }) => get(properties, `${LAYOUT_PROPERTY}.value.${US_ENGLISH_LANG}`, null) !== ONE_BUTTON_LAYOUT.key,
    },
    {
      ...ACTBLUE_EXPRESS_DISCLAIMER_COPY.field,
      id: EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
      inheritFromSetting: ACTBLUE_EXPRESS_DISCLAIMER_COPY.key,
      required: true,
      conditional: ({ properties }) => !!get(properties, `${ENABLE_EXPRESS_DONATE_PROPERTY}.value.${US_ENGLISH_LANG}`, false),
    },
    {
      id: EXPRESS_DONATE_TEXT_COLOR_PROPERTY,
      label: 'Express Donate Legal Disclaimer Text Color',
      help: 'This text must have high contrast with the background of the form',
      type: COLOR_TYPE,
      required: true,
      defaultCampaignThemeValue: ({ campaignTheme }) => campaignTheme.colors.black,
      conditional: ({ properties }) => !!get(properties, `${ENABLE_EXPRESS_DONATE_PROPERTY}.value.${US_ENGLISH_LANG}`, false),
    },
    {
      ...DEFAULT_ACTBLUE_REFCODE.field,
      id: REFCODE_PROPERTY,
      inheritFromSetting: DEFAULT_ACTBLUE_REFCODE.key,
    },
    {
      ...ACTBLUE_REFCODE_CARRY_ADS_SOURCE.field,
      id: CARRY_TRACKING_SOURCE_PROPERTY,
      inheritFromSetting: ACTBLUE_REFCODE_CARRY_ADS_SOURCE.key,
    },
  ],
};

export default ActBlueDonateFormMeta;
