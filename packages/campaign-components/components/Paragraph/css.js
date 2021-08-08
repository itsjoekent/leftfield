import get from 'lodash/get';
import {
  PARAGRAPH_STYLE,
  PARAGRAPH_LINK_STYLE,
} from 'pkg.campaign-components/components/Paragraph/meta';
import LinkStyle from 'pkg.campaign-components/styles/link';
import MarkupStyle from 'pkg.campaign-components/styles/markup';
import applyStyleIfChangedGenerator from 'pkg.campaign-components/utils/applyStyleIfChangedGenerator';

export default function ParagraphCSS({
  componentClassName,
  theme,
  styles,
}) {
  const applyStyleIfChanged = applyStyleIfChangedGenerator();
  const paragraphStyle = get(styles, PARAGRAPH_STYLE, {});
  const paragraphLinkStyle = get(styles, PARAGRAPH_LINK_STYLE, {});

  return `
    .${componentClassName} {
      ${MarkupStyle.styling({
        applyStyleIfChanged,
        theme,
        styles: paragraphStyle,
      })}

      a {
        ${LinkStyle.styling({
          applyStyleIfChanged,
          theme,
          styles: paragraphLinkStyle,
        })}
      }
    }
  `;
}
