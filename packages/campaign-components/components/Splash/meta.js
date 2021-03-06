import get from 'lodash/get';
import {
  TAG,
  PHOTO_ALT_PROPERTY,
  PHOTO_SOURCE_PROPERTY,
  CONTENT_SLOT,
  CONTENT_STYLE,
  PHOTO_STYLE,
  PHOTO_HORIZONTAL_POSITION_ATTRIBUTE,
  PHOTO_VERTICAL_POSITION_ATTRIBUTE,
  PHOTO_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/components/Splash';
import {
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
  IS_RELATIVE,
} from 'pkg.campaign-components/constants/layout';
import {
  NUMBER_RANGE_TYPE,
  SHORT_TEXT_TYPE,
  UPLOAD_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import { MOBILE_DEVICE } from 'pkg.campaign-components/constants/responsive';
import { TAG as RootTag } from 'pkg.campaign-components/components/Root';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import ImagePositionStyle from 'pkg.campaign-components/styles/imagePosition';

const SplashMeta = {
  tag: TAG,
  name: 'Splash',
  version: '1',
  shortDescription: 'Full page layout with a photo and content',
  placementConstraints: [
    {
      childOf: RootTag,
    },
  ],
  properties: [
    {
      id: PHOTO_SOURCE_PROPERTY,
      label: 'Image',
      help: 'Upload the highest resolution image you have, Leftfield will automatically crop and compress your media',
      type: UPLOAD_TYPE,
      allow: [
        'image/avif',
        'image/jpeg',
        'image/png',
        'image/webp',
      ],
      required: true,
    },
    {
      id: PHOTO_ALT_PROPERTY,
      label: 'Photo Alt Text',
      help: 'A concise description of the photo to help visually impaired site visitors',
      isTranslatable: true,
      type: SHORT_TEXT_TYPE,
      required: true,
    },
  ],
  slots: [
    {
      id: CONTENT_SLOT,
      label: 'Splash Content',
      required: true,
      isList: true,
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
    },
  ],
  styles: [
    {
      id: PHOTO_STYLE,
      label: 'Photo',
      attributes: [
        {
          id: PHOTO_SIZE_ATTRIBUTE,
          label: 'Photo Size',
          help: 'On mobile and tablet this is a percent of the browser height, on desktop this is a percent of the browser width',
          type: NUMBER_RANGE_TYPE,
          min: 25,
          max: 75,
          incrementBy: 1,
          defaultValue: {
            [MOBILE_DEVICE]: {
              custom: 40,
            },
          },
        },
        ...ImagePositionStyle.attributes(),
      ],
    },
    {
      id: CONTENT_STYLE,
      label: 'Content',
      attributes: [
        ...BoxStyle.attributes(),
        ...FlexStyle.attributes(),
      ],
    },
  ],
};

export default SplashMeta;
