import React from 'react';
import get from 'lodash/get';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import serializeRichText from 'pkg.campaign-components/utils/serializeRichText';

export const TAG = 'Paragraph';

export const COPY_PROPERTY = 'COPY_PROPERTY';

export const PARAGRAPH_STYLE = 'PARAGRAPH_STYLE';
export const PARAGRAPH_LINK_STYLE = 'PARAGRAPH_LINK_STYLE';

export default function Paragraph(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();
  const richText = getPropertyValue(properties, COPY_PROPERTY, language) || '';

  const html = serializeRichText({
    value: richText,
    blockClassName: componentClassName,
  });

  return serializeRichText({
    value: richText,
    blockClassName: componentClassName,
    renderToElement: true,
  });
}
