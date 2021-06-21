import get from 'lodash.get';
import documentation from '@cc/components/ActBlueDonateForm/docs.md';
import makeValidationError from '@cc/utils/makeValidationError';
import {
  COLOR_TYPE,
  SELECT_TYPE,
  TOGGLE_TYPE,
} from '@cc/constants/property-types';
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

export const ONE_BUTTON_LAYOUT = 'One Button';
export const WIDE_LAYOUT = 'Wide single row';
export const TWO_COLUMN_LAYOUT = 'Two Columns';
export const THREE_COLUMN_LAYOUT = 'Three columns';
export const FOUR_COLUMN_LAYOUT = 'Four columns';

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
      conditional: ({ properties }) => properties.layout !== ONE_BUTTON_LAYOUT,
    },
  ],
  slots: [
    {
      id: DONATE_BUTTONS_SLOT,
      label: 'Donate Buttons',
      list: true,
      conditional: ({ properties }) => properties.layout !== ONE_BUTTON_LAYOUT,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
      customValidation: ({ properties, children }) => {
        if (
          [TWO_COLUMN_LAYOUT, THREE_COLUMN_LAYOUT].includes(properties[LAYOUT_PROPERTY])
          && children.length !== 6
        ) {
          return makeValidationError('Must have 6 buttons');
        }

        if (
          properties[LAYOUT_PROPERTY] === FOUR_COLUMN_LAYOUT
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
      list: false,
      conditional: ({ properties }) => properties.layout === ONE_BUTTON_LAYOUT,
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
      list: true,
      min: 1,
      max: 4,
      conditional: ({ properties }) => properties.layout === WIDE_LAYOUT,
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
      list: true,
      min: 1,
      max: 8,
      conditional: ({ properties }) => properties.layout === WIDE_LAYOUT,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: false,
      },
    },
  ],
  properties: {
    [LAYOUT_PROPERTY]: {
      label: 'Form Layout',
      type: SELECT_TYPE,
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
          return WIDE_LAYOUT;
        }

        return TWO_COLUMN_LAYOUT;
      },
    },
    [ACTBLUE_FORM_PROPERTY]: {
      ...DEFAULT_ACTBLUE_DONATION_FORM.field,
      inheritFromSetting: DEFAULT_ACTBLUE_DONATION_FORM.key,
      required: true,
    },
    [ENABLE_EXPRESS_DONATE_PROPERTY]: {
      label: 'Enable ActBlue Express',
      help: 'This will make donations 1-click for donors with card details saved to ActBlue. A small disclaimer will be added below your donation buttons.',
      type: TOGGLE_TYPE,
      defaultValue: false,
      conditional: ({ properties }) => properties[LAYOUT_PROPERTY] !== ONE_BUTTON_LAYOUT,
    },
    [EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY]: {
      ...ACTBLUE_EXPRESS_DISCLAIMER_COPY.field,
      inheritFromSetting: ACTBLUE_EXPRESS_DISCLAIMER_COPY.key,
      required: true,
    },
    [EXPRESS_DONATE_TEXT_COLOR_PROPERTY]: {
      label: 'Express Donate Legal Disclaimer Text Color',
      help: 'This text must be legible.',
      type: COLOR_TYPE,
      required: true,
      defaultCampaignThemeValue: ({ campaignTheme }) => campaignTheme.colors.black,
      conditional: ({ properties }) => !!properties[ENABLE_EXPRESS_DONATE_PROPERTY],
    },
    [REFCODE_PROPERTY]: {
      ...DEFAULT_ACTBLUE_REFCODE.field,
      inheritFromSetting: DEFAULT_ACTBLUE_REFCODE.key,
    },
    [CARRY_TRACKING_SOURCE_PROPERTY]: {
      ...ACTBLUE_REFCODE_CARRY_ADS_SOURCE.field,
      inheritFromSetting: ACTBLUE_REFCODE_CARRY_ADS_SOURCE.key,
    },
  },
};

export default ActBlueDonateFormMeta;
