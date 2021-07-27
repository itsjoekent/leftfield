import get from 'lodash/get';
import {
  CONTENT_CONTAINER_STYLE,
  PARAGRAPH_STYLE,
  HEADER_1_STYLE,
  HEADER_2_STYLE,
  HEADER_3_STYLE,
  HEADER_4_STYLE,
} from 'pkg.campaign-components/components/Content/meta';
import BoxStyle from 'pkg.campaign-components/styles/box';
import FlexStyle from 'pkg.campaign-components/styles/flex';
import MarkupStyle from 'pkg.campaign-components/styles/markup';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function ContentCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();

  const contentContainerStyle = get(styles, CONTENT_CONTAINER_STYLE, {});
  const paragraphStyle = get(styles, PARAGRAPH_STYLE, {});
  const header1Style = get(styles, HEADER_1_STYLE, {});
  const header2Style = get(styles, HEADER_2_STYLE, {});
  const header3Style = get(styles, HEADER_3_STYLE, {});
  const header4Style = get(styles, HEADER_4_STYLE, {});

  return `
    .${componentClassName} {
      width: 100%;

      ${BoxStyle.styling({
        applyStyleIfChanged,
        styles: contentContainerStyle,
        theme,
      })}

      ${FlexStyle.styling({
        applyStyleIfChanged,
        styles: contentContainerStyle,
        theme,
      })}

      p {
        ${MarkupStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: paragraphStyle,
        })}
      }

      h1 {
        ${MarkupStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: header1Style,
        })}
      }

      h2 {
        ${MarkupStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: header2Style,
        })}
      }

      h3 {
        ${MarkupStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: header3Style,
        })}
      }

      h4 {
        ${MarkupStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: header4Style,
        })}
      }
    }
  `;
}
