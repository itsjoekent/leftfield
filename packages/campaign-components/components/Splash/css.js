import get from 'lodash/get';
import {
  CONTENT_STYLE,
  PHOTO_STYLE,
  PHOTO_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/components/Splash/meta';
import {
  DESKTOP_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import applyStyleIf from 'pkg.campaign-components/utils/applyStyleIf';
import getStyleValue from 'pkg.campaign-components/utils/getStyleValue';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

export const PHOTO_COLUMN_CLASS_NAME = 'photo-column';
export const CONTENT_COLUMN_CLASS_NAME = 'content-column';

export default function SplashCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const contentStyles = get(styles, CONTENT_STYLE, {});
  const photoStyles = get(styles, PHOTO_STYLE, {});

  return `
    .${componentClassName} {
      display: flex;
      flex-direction: column;

      width: 100vw;
      height: 100vh;

      position: absolute;
      z-index: ${theme.zIndexes.overlay};
      top: 0;
      left: 0;

      @media (${theme.deviceBreakpoints.desktopSmallUp}) {
        flex-direction: row;
        max-height: 100vh;
      }

      .${CONTENT_COLUMN_CLASS_NAME} {
        flex-grow: 1;

        ${BoxStyle.styling({
          applyStyleIfChanged,
          styles: contentStyles,
          theme,
        })}

        ${FlexStyle.styling({
          applyStyleIfChanged,
          styles: contentStyles,
          theme,
        })}

        @media (${theme.deviceBreakpoints.desktopSmallUp}) {
          overflow-y: scroll;
        }
      }

      .${PHOTO_COLUMN_CLASS_NAME} {
        display: flex;

        ${responsiveStyleGenerator(
          applyStyleIfChanged,
          theme,
          {
            styles: photoStyles,
            attribute: PHOTO_SIZE_ATTRIBUTE,
          },
          (styleValue) => `flex: 0 0 ${styleValue}%;`,
        )}

        img {
          object-fit: cover;
          object-position: right;
        }
      }
    }
  `;
}
