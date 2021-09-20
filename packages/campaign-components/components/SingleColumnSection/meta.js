import get from 'lodash/get';
import {
  TAG,
  BACKGROUND_IMAGE_SOURCE_PROPERTY,
  BACKGROUND_IMAGE_ALT_PROPERTY,
  CONTENT_SLOT,
  BACKGROUND_IMAGE_STYLE,
  CONTAINER_STYLE,
  CONTENT_STYLE,
  BACKGROUND_IMAGE_HORIZONTAL_POSITION_ATTRIBUTE,
  BACKGROUND_IMAGE_VERTICAL_POSITION_ATTRIBUTE,
} from 'pkg.campaign-components/components/SingleColumnSection';
import {
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
  IS_RELATIVE,
} from 'pkg.campaign-components/constants/layout';
import {
  SHORT_TEXT_TYPE,
  UPLOAD_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import BoxStyle, {
  BORDER_RADIUS_ATTRIBUTE,
  BOX_SHADOW_ENABLE_ATTRIBUTE,
  MAX_WIDTH_UNIT_ATTRIBUTE,
} from 'pkg.campaign-components/styles/box';
import FlexStyle, {
  DIRECTION_ATTRIBUTE,
  GRID_GAP_ATTRIBUTE,
  ALIGN_ATTRIBUTE,
  JUSTIFY_ATTRIBUTE,
  WRAP_ATTRIBUTE,
  START_ALIGNMENT,
  END_ALIGNMENT,
  CENTER_ALIGNMENT,
} from 'pkg.campaign-components/styles/flex';
import ImagePositionStyle from 'pkg.campaign-components/styles/imagePosition';

const SingleColumnSectionMeta = {
  tag: TAG,
  name: 'Single Column Section',
  version: '1',
  shortDescription: 'Page section with a single content area and an optional background image',
  properties: [
    {
      id: BACKGROUND_IMAGE_SOURCE_PROPERTY,
      label: 'Background Image',
      help: 'Upload the highest resolution image you have, Leftfield will automatically crop and compress your media',
      type: UPLOAD_TYPE,
      allow: [
        'image/avif',
        'image/jpeg',
        'image/png',
        'image/webp',
      ],
    },
    {
      id: BACKGROUND_IMAGE_ALT_PROPERTY,
      label: 'Background Alt Text',
      help: 'A concise description of the background image to help visually impaired site visitors',
      isTranslatable: true,
      type: SHORT_TEXT_TYPE,
    },
  ],
  slots: [
    {
      id: CONTENT_SLOT,
      label: 'Section Content',
      required: true,
      isList: true,
      layout: {
        [FILLS_CONTAINER_WIDE]: false,
        [GROWS_VERTICALLY]: true,
      },
    },
  ],
  styles: [
    {
      id: BACKGROUND_IMAGE_STYLE,
      label: 'Background Image',
      attributes: [
        ...ImagePositionStyle.attributes(),
      ],
    },
    {
      id: CONTAINER_STYLE,
      label: 'Section',
      attributes: [
        ...BoxStyle.attributes({
          [BORDER_RADIUS_ATTRIBUTE]: {
            hideIf: {
              compare: BORDER_RADIUS_ATTRIBUTE,
              test: () => true,
            },
          },
          [BOX_SHADOW_ENABLE_ATTRIBUTE]: {
            hideIf: {
              compare: BOX_SHADOW_ENABLE_ATTRIBUTE,
              test: () => true,
            },
          },
          [MAX_WIDTH_UNIT_ATTRIBUTE]: {
            hideIf: {
              compare: MAX_WIDTH_UNIT_ATTRIBUTE,
              test: () => true,
            },
          },
        }),
        ...FlexStyle.attributes({
          [DIRECTION_ATTRIBUTE]: {
            hideIf: {
              compare: DIRECTION_ATTRIBUTE,
              test: () => true,
            },
          },
          [GRID_GAP_ATTRIBUTE]: {
            hideIf: {
              compare: GRID_GAP_ATTRIBUTE,
              test: () => true,
            },
          },
          [ALIGN_ATTRIBUTE]: {
            label: 'Column Vertical Placement',
            help: '',
            options: [
              { label: 'Top', value: START_ALIGNMENT },
              { label: 'Center', value: CENTER_ALIGNMENT },
              { label: 'Bottom', value: END_ALIGNMENT },
            ],
          },
          [JUSTIFY_ATTRIBUTE]: {
            label: 'Column Horizontal Placement',
            help: '',
            options: [
              { label: 'Left', value: START_ALIGNMENT },
              { label: 'Center', value: CENTER_ALIGNMENT },
              { label: 'Right', value: END_ALIGNMENT },
            ],
          },
          [WRAP_ATTRIBUTE]: {
            hideIf: {
              compare: WRAP_ATTRIBUTE,
              test: () => true,
            },
          },
        }),
      ],
    },
    {
      id: CONTENT_STYLE,
      label: 'Content Column',
      attributes: [
        ...BoxStyle.attributes(),
      ],
    },
  ],
}

export default SingleColumnSectionMeta;
