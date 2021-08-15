import get from 'lodash/get';
import {
  CONTENT_STYLE,
  PHOTO_STYLE,
  PHOTO_COLUMN_CLASS_NAME,
  CONTENT_COLUMN_CLASS_NAME,
  PHOTO_HORIZONTAL_POSITION_ATTRIBUTE,
  PHOTO_VERTICAL_POSITION_ATTRIBUTE,
  PHOTO_SIZE_ATTRIBUTE,
} from 'pkg.campaign-components/components/Splash';
import {
  DESKTOP_DEVICE,
  MOBILE_DEVICE,
  TABLET_DEVICE,
} from 'pkg.campaign-components/constants/responsive';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import getCascadingStyleValue from 'pkg.campaign-components/utils/getCascadingStyleValue';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';

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
        width: 100%;

        /* Because of the change in layout direction, we need to make sure the value is always applied */

        ${applyStyleIfChanged(
          {
            styles: photoStyles,
            attribute: PHOTO_SIZE_ATTRIBUTE,
          },
          (styleValue) => `height: ${styleValue}%;`,
        )}

        @media (${theme.deviceBreakpoints.tabletUp}) {
          ${applyStyleIfChanged(
            {
              styles: photoStyles,
              attribute: PHOTO_SIZE_ATTRIBUTE,
              device: TABLET_DEVICE,
            },
            (styleValue) => `height: ${styleValue}%;`,
          )}
        }

        @media (${theme.deviceBreakpoints.desktopSmallUp}) {
          height: 100%;
          width: ${getCascadingStyleValue({
            styles: photoStyles,
            attribute: PHOTO_SIZE_ATTRIBUTE,
            devices: [DESKTOP_DEVICE, TABLET_DEVICE, MOBILE_DEVICE],
          })}%;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;

          ${responsiveStyleGenerator(
            applyStyleIfChanged,
            theme,
            [
              { styles: photoStyles, attribute: PHOTO_VERTICAL_POSITION_ATTRIBUTE },
              { styles: photoStyles, attribute: PHOTO_HORIZONTAL_POSITION_ATTRIBUTE },
            ],
            (styleValue) => `object-position: ${styleValue[0]} ${styleValue[1]};`,
          )}
        }
      }
    }
  `;
}
