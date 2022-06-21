import get from 'lodash/get';
import { SELECT_TYPE } from 'pkg.campaign-components/constants/property-types';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const POSITION_TOP = 'top';
export const POSITION_BOTTOM = 'bottom';
export const POSITION_LEFT = 'left';
export const POSITION_RIGHT = 'right';
export const POSITION_CENTER = 'center';

export const KEY = 'ImagePositionStyle';

export const PHOTO_HORIZONTAL_POSITION_ATTRIBUTE = 'PHOTO_HORIZONTAL_POSITION_ATTRIBUTE';
export const PHOTO_VERTICAL_POSITION_ATTRIBUTE = 'PHOTO_VERTICAL_POSITION_ATTRIBUTE';

const ImagePositionStyle = {
  key: KEY,
  humanName: 'Image Position Style',
  attributes: (overrides) => ([
    {
      id: PHOTO_VERTICAL_POSITION_ATTRIBUTE,
      label: 'Vertical Position',
      type: SELECT_TYPE,
      options: [
        { label: 'Top', value: POSITION_TOP },
        { label: 'Center', value: POSITION_CENTER },
        { label: 'Bottom', value: POSITION_BOTTOM },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: POSITION_CENTER,
        },
      },
      ...(get(overrides, PHOTO_VERTICAL_POSITION_ATTRIBUTE, {})),
    },
    {
      id: PHOTO_HORIZONTAL_POSITION_ATTRIBUTE,
      label: 'Horizontal Position',
      type: SELECT_TYPE,
      options: [
        { label: 'Left', value: POSITION_LEFT },
        { label: 'Center', value: POSITION_CENTER },
        { label: 'Right', value: POSITION_RIGHT },
      ],
      defaultValue: {
        [MOBILE_DEVICE]: {
          custom: POSITION_RIGHT,
        },
      },
      ...(get(overrides, PHOTO_HORIZONTAL_POSITION_ATTRIBUTE, {})),
    },
  ]),
  styling: ({ applyStyleIfChanged, styles, theme }) => `
    object-fit: cover;

    ${responsiveStyleGenerator(
      applyStyleIfChanged,
      theme,
      [
        { styles, attribute: PHOTO_VERTICAL_POSITION_ATTRIBUTE },
        { styles, attribute: PHOTO_HORIZONTAL_POSITION_ATTRIBUTE },
      ],
      (styleValue) => `object-position: ${styleValue[0]} ${styleValue[1]};`,
    )}
  `,
}

export default ImagePositionStyle;
