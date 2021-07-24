import {
  FULL_SCREEN_WIDTH,
  FILLS_CONTAINER_WIDE,
  GROWS_VERTICALLY,
  IS_RELATIVE,
} from 'pkg.campaign-components/constants/layout';
import {
  OPEN_GRID_TRAIT,
  SECTION_TRAIT,
} from 'pkg.campaign-components/constants/traits';
import BoxStyle from 'pkg.campaign-components/styles/box';

export const TAG = 'Root';

export const SECTIONS_SLOT = 'SECTIONS_SLOT';

export const BACKGROUND_STYLE = 'BACKGROUND_STYLE';

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
      required: true,
      isList: true,
      layout: {
        [FILLS_CONTAINER_WIDE]: true,
        [FULL_SCREEN_WIDTH]: true,
        [GROWS_VERTICALLY]: true,
        [IS_RELATIVE]: true,
      },
      constraints: [
        { oneOf: [SECTION_TRAIT] },
      ],
    },
  ],
  styles: [
    {
      id: BACKGROUND_STYLE,
      label: 'Page Background',
      attributes: BoxStyle.attributes(),
    },
  ],
};

export default RootMeta;
