import get from 'lodash/get';
import documentation from 'pkg.campaign-components/components/ActBlueDonateForm/docs.md';
import makeValidationError from 'pkg.campaign-components/utils/makeValidationError';
import {
  COLOR_TYPE,
  CHECKLIST_TYPE,
  NUMBER_RANGE_TYPE,
  TOGGLE_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import { US_ENGLISH_LANG } from 'pkg.campaign-components/constants/languages';
import {
  FILLS_CONTAINER_WIDE,
  FITS_CONTENT,
  FULL_SCREEN_WIDTH,
  GROWS_VERTICALLY,
} from 'pkg.campaign-components/constants/layout';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import {
  FUNDRAISING_TRAIT,
  ACTBLUE_TRAIT,
  DONATE_FORM_TRAIT,
  DONATE_BUTTON_TRAIT,
  OPEN_GRID_TRAIT,
} from 'pkg.campaign-components/constants/traits';
import {
  ACTBLUE_REFCODE_CARRY_ADS_SOURCE,
  ACTBLUE_EXPRESS_DISCLAIMER_COPY,
  DEFAULT_ACTBLUE_DONATION_FORM,
  DEFAULT_ACTBLUE_REFCODE,
} from 'pkg.campaign-components/constants/settings';
import BoxStyle from 'pkg.campaign-components/styles/box';
import GridStyle from 'pkg.campaign-components/styles/grid';
import TextStyle, { FONT_SIZE_ATTRIBUTE } from 'pkg.campaign-components/styles/text';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';

export const TAG = 'ActBlueDonateForm';

export const ACTBLUE_FORM_PROPERTY = 'ACTBLUE_FORM_PROPERTY';
export const ENABLE_EXPRESS_DONATE_PROPERTY = 'ENABLE_EXPRESS_DONATE_PROPERTY';
export const EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY = 'EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY';
export const REFCODE_PROPERTY = 'REFCODE_PROPERTY';
export const CARRY_TRACKING_SOURCE_PROPERTY = 'CARRY_TRACKING_SOURCE_PROPERTY';

export const DONATE_BUTTONS_SLOT = 'DONATE_BUTTONS_SLOT';
export const WIDE_MOBILE_DONATE_BUTTONS_SLOT = 'WIDE_MOBILE_DONATE_BUTTONS_SLOT';
export const WIDE_DESKTOP_DONATE_BUTTONS_SLOT = 'WIDE_DESKTOP_DONATE_BUTTONS_SLOT';

export const DISCLAIMER_TEXT_STYLE = 'DISCLAIMER_TEXT_STYLE';
export const GRID_STYLE = 'GRID_STYLE';

export const DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE = 'DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE';

const ActBlueDonateFormMeta = {
  tag: TAG,
  name: 'ActBlue Donate Form',
  version: '1',
  shortDescription: 'Container for ActBlue donate button(s)',
  documentation,
  placementConstraints: [
    {
      includeLayout: [
        { key: GROWS_VERTICALLY, mustBe: true },
      ],
      conditional: ({ slots }) => get(slots, `${DONATE_BUTTONS_SLOT}.length`, 0) > 1,
    },
  ],
  properties: [
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
      conditional: ({ slots }) => get(slots, `${DONATE_BUTTONS_SLOT}.length`, 0) > 1,
    },
    {
      ...ACTBLUE_EXPRESS_DISCLAIMER_COPY.field,
      id: EXPRESS_DONATE_DISCLAIMER_COPY_PROPERTY,
      inheritFromSetting: ACTBLUE_EXPRESS_DISCLAIMER_COPY.key,
      required: true,
      conditional: ({ properties }) => !!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY),
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
  slots: [
    {
      id: DONATE_BUTTONS_SLOT,
      label: 'Donate Buttons',
      required: true,
      isList: true,
      constraints: [
        { includeTrait: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
    },
  ],
  styles: [
    {
      id: GRID_STYLE,
      label: 'Grid Style',
      attributes: [
        ...GridStyle.attributes(),
        ...BoxStyle.attributes(),
        {
          id: DISCLAIMER_TEXT_TOP_MARGIN_ATTRIBUTE,
          label: 'Express Disclaimer Top Spacing',
          help: 'Space between the express disclaimer copy and the donate button grid',
          type: NUMBER_RANGE_TYPE,
          min: 2,
          max: 24,
          incrementBy: 2,
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 6,
            },
          },
        },
      ],
    },
    {
      id: DISCLAIMER_TEXT_STYLE,
      label: 'Disclaimer Text Style',
      type: TextStyle.key,
      attributes: TextStyle.attributes({
        [FONT_SIZE_ATTRIBUTE]: {
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 12,
            },
          },
        },
      }),
      conditional: ({ properties }) => !!getPropertyValue(properties, ENABLE_EXPRESS_DONATE_PROPERTY),
    },
  ],
  traits: [
    FUNDRAISING_TRAIT,
    ACTBLUE_TRAIT,
    DONATE_FORM_TRAIT,
  ],
};

export default ActBlueDonateFormMeta;
