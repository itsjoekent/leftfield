import React from 'react';
import get from 'lodash/get';
import { COPY_PROPERTY } from 'pkg.campaign-components/components/Content/meta';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import serializeRichText from 'pkg.campaign-components/utils/serializeRichText';

export default function Content(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();
  const richText = getPropertyValue(properties, COPY_PROPERTY, language) || '';
  const html = serializeRichText(richText);

  return (
    <div
      className={componentClassName}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
