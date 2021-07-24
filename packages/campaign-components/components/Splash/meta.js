import get from 'lodash/get';
import {
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
  IS_RELATIVE,
} from 'pkg.campaign-components/constants/layout';
import {
  NUMBER_RANGE_TYPE,
  SHORT_TEXT_TYPE,
} from 'pkg.campaign-components/constants/property-types';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import { TAG as RootTag } from 'pkg.campaign-components/components/Root/meta';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';

export const TAG = 'Splash';

export const PHOTO_ALT_PROPERTY = 'PHOTO_ALT_PROPERTY';

export const CONTENT_SLOT = 'CONTENT_SLOT';

export const CONTENT_STYLE = 'CONTENT_STYLE';
export const PHOTO_STYLE = 'PHOTO_STYLE';

export const PHOTO_SIZE_ATTRIBUTE = 'PHOTO_SIZE_ATTRIBUTE';

const SplashMeta = {
  tag: TAG,
  name: 'Splash',
  shortDescription: 'Full page layout with a photo and content',
  placementConstraints: [
    {
      childOf: RootTag,
    },
  ],
  properties: [
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
      label: 'Splash Photo',
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
            [TABLET_DEVICE]: {
              custom: 50,
            },
            [DESKTOP_DEVICE]: {
              custom: 60,
            },
          },
        },
      ],
    },
    {
      id: CONTENT_STYLE,
      label: 'Splash Content',
      attributes: [
        ...BoxStyle.attributes(),
        ...FlexStyle.attributes(),
      ],
    },
  ],
};

export default SplashMeta;
