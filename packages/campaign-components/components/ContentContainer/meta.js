import get from 'lodash/get';
import {
  TAG,
  CONTENT_CONTAINER_SLOT,
  CONTENT_CONTAINER_STYLE,
} from 'pkg.campaign-components/components/ContentContainer';
import {
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
} from 'pkg.campaign-components/constants/layout';
import { CONTENT_TRAIT } from 'pkg.campaign-components/constants/traits';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';

const ContentContainerMeta = {
  tag: TAG,
  name: 'Content Container',
  version: '1',
  shortDescription: 'Basic content layout',
  slots: [
    {
      id: CONTENT_CONTAINER_SLOT,
      label: 'Content Components',
      required: true,
      isList: true,
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
      constraints: [
        { oneOf: [CONTENT_TRAIT] },
      ],
    },
  ],
  styles: [
    {
      id: CONTENT_CONTAINER_STYLE,
      label: 'Layout',
      attributes: [
        ...BoxStyle.attributes(),
        ...FlexStyle.attributes(),
      ],
    },
  ],
};

export default ContentContainerMeta;
