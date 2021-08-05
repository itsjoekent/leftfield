import React from 'react';
import get from 'lodash/get';
import { COPY_PROPERTY } from 'pkg.campaign-components/components/Paragraph/meta';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import serializeRichText from 'pkg.campaign-components/utils/serializeRichText';

export default function Paragraph(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();
  const richText = getPropertyValue(properties, COPY_PROPERTY, language) || '';
  const html = serializeRichText(richText, true);

  return (
    <p
      className={componentClassName}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
