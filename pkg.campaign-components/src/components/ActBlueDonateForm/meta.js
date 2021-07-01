import { get } from 'lodash';
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

export const TAG = 'ActBlueDonateForm';

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
      conditional: ({ properties }) => properties.layout !== ONE_BUTTON_LAYOUT,
    },
  ],
  slots: [
    {
      id: DONATE_BUTTONS_SLOT,
      label: 'Donate Buttons',
      isList: true,
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
      isList: false,
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
      isList: true,
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
      isList: true,
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
  properties: [
    {
      id: LAYOUT_PROPERTY,
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
    {
      ...DEFAULT_ACTBLUE_DONATION_FORM.field,
      id: ACTBLUE_FORM_PROPERTY,
      inheritFromSetting: DEFAULT_ACTBLUE_DONATION_FORM.key,
      required: true,
    },
    {
      id: ENABLE_EXPRESS_DONATE_PROPERTY,
      label: 'Enable ActBlue Express',
      help: 'This will make donations 1-click for donors with card details saved to ActBlue. A small disclaimer will be added below your donation buttons.',
      type: TOGGLE_TYPE,
      defaultValue: false,
      conditional: ({ properties }) => properties[LAYOUT_PROPERTY] !== ONE_BUTTON_LAYOUT,
    },
    {
      ...ACTBLUE_EXPRESS_DISCLAIMER_COPY.field,
      id: EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
      inheritFromSetting: ACTBLUE_EXPRESS_DISCLAIMER_COPY.key,
      required: true,
    },
    {
      id: EXPRESS_DONATE_TEXT_COLOR_PROPERTY,
      label: 'Express Donate Legal Disclaimer Text Color',
      help: 'This text must be legible.',
      type: COLOR_TYPE,
      required: true,
      defaultCampaignThemeValue: ({ campaignTheme }) => campaignTheme.colors.black,
      conditional: ({ properties }) => !!properties[ENABLE_EXPRESS_DONATE_PROPERTY],
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
