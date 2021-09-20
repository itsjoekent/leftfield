import get from 'lodash/get';
import {
  BACKGROUND_IMAGE_CLASS_NAME,
  BACKGROUND_IMAGE_STYLE,
  BACKGROUND_IMAGE_HORIZONTAL_POSITION_ATTRIBUTE,
  BACKGROUND_IMAGE_VERTICAL_POSITION_ATTRIBUTE,
  CONTAINER_STYLE,
  CONTENT_COLUMN_CLASS_NAME,
  CONTENT_STYLE,
} from 'pkg.campaign-components/components/SingleColumnSection';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import responsiveStyleGenerator from 'pkg.campaign-components/utils/responsiveStyleGenerator';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function SingleColumnSectionCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const backgroundImageStyles = get(styles, BACKGROUND_IMAGE_STYLE, {});
  const containerStyles = get(styles, CONTAINER_STYLE, {});
  const contentStyles = get(styles, CONTENT_STYLE, {});

  const applyStyleIfChangedBackgroundImage = applyStyleIfChangedGenerator();
  const applyStyleIfChangedContainer = applyStyleIfChangedGenerator();
  const applyStyleIfChangedContent = applyStyleIfChangedGenerator();

  return `
    .${componentClassName} {
      ${BoxStyle.styling({
        applyStyleIfChanged: applyStyleIfChangedContainer,
        styles: containerStyles,
        theme,
      })}

      ${FlexStyle.styling({
        applyStyleIfChanged: applyStyleIfChangedContainer,
        styles: containerStyles,
        theme,
      })}

      flex-direction: row;
      width: 100vw;
      min-height: 100vh;
      position: relative;

      > img {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;

        ${responsiveStyleGenerator(
          applyStyleIfChangedBackgroundImage,
          theme,
          [
            {
              styles: backgroundImageStyles,
              attribute: BACKGROUND_IMAGE_VERTICAL_POSITION_ATTRIBUTE,
            },
            {
              styles: backgroundImageStyles,
              attribute: BACKGROUND_IMAGE_HORIZONTAL_POSITION_ATTRIBUTE,
            },
          ],
          (styleValue) => `object-position: ${styleValue[0]} ${styleValue[1]};`,
        )}
      }

      > .${CONTENT_COLUMN_CLASS_NAME} {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: fit-content;
        z-index: 1;

        ${BoxStyle.styling({
          applyStyleIfChanged: applyStyleIfChangedContent,
          styles: contentStyles,
          theme,
        })}
      }
    }
  `;
}
