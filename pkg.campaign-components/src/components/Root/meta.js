import {
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
} from '@cc/constants/layout';
import {
  OPEN_GRID_TRAIT,
  SECTION_TRAIT,
} from '@cc/constants/traits';

export const TAG = 'ROOT';

export const SECTIONS_SLOT = 'SECTIONS_SLOT';

const RootMeta = {
  tag: TAG,
  name: 'Root Page Element',
  shortDescription: 'Contains all page elements',
  devOnly: true,
  traits: [
    OPEN_GRID_TRAIT,
  ],
  slots: [
    {
      id: SECTIONS_SLOT,
      label: 'Page Sections',
      list: true,
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [GROWS_VERTICALLY]: true,
      },
      constraints: [
        { oneOf: [SECTION_TRAIT] },
      ],
    },
  ],
};

export default RootMeta;
