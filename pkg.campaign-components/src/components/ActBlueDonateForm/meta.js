import get from 'lodash.get';
import documentation from '@cc/components/ActBlueDonateForm/docs.md';
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
  DEFAULT_DONATE_BUTTON_COLOR,
} from '@cc/constants/settings';

const LAYOUT_ONE_BUTTON = 'One Button';
const WIDE_LAYOUT = 'Wide single row';
const TWO_COLUMN_LAYOUT = 'Two Columns';
const THREE_COLUMN_LAYOUT = 'Three columns';
const FOUR_COLUMN_LAYOUT = 'Four columns';

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
      conditional: ({ properties }) => properties.layout !== LAYOUT_ONE_BUTTON,
    },
  ],
  slots: [
    {
      name: 'buttons',
      list: true,
      min: 1,
      max: 8,
      conditional: ({ properties }) => properties.layout !== LAYOUT_ONE_BUTTON,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
    },
    {
      name: 'button',
      list: false,
      conditional: ({ properties }) => properties.layout === LAYOUT_ONE_BUTTON,
      constraints: [
        { include: [DONATE_BUTTON_TRAIT] },
      ],
      layout: {
        [FITS_CONTENT]: true,
      },
    },
  ],
  properties: {
    layout: {
      label: 'Form Layout',
      type: 'select',
      required: true,
      dynamicOptions: ({ slot }) => {
        if (get(slot, `layout.${FULL_SCREEN_WIDTH}`)) {
          return [LAYOUT_ONE_BUTTON, WIDE_LAYOUT];
        }

        return [
          LAYOUT_ONE_BUTTON,
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
    color: {
      label: 'Button Text Color',
      type: 'color',
      required: true,
      inheritFromSetting: DEFAULT_DONATE_BUTTON_COLOR,
      defaultThemeValue: 'colors..?',
    },
    backgroundColor: {
      label:
    },
  },
};

export default ActBlueDonateFormMeta;
