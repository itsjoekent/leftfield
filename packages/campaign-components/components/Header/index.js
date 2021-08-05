import React from 'react';
import get from 'lodash/get';
import { COPY_PROPERTY, LEVEL_PROPERTY } from 'pkg.campaign-components/components/Header/meta';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import serializeRichText from 'pkg.campaign-components/utils/serializeRichText';

export default function Header(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();

  const level = getPropertyValue(properties, LEVEL_PROPERTY) || 1;

  const richText = getPropertyValue(properties, COPY_PROPERTY, language) || '';
  const html = serializeRichText(richText, true);

  const headerProps = {
    className: componentClassName,
    dangerouslySetInnerHTML: { __html: html },
  };

  return React.createElement(`h${level}`, headerProps);
}
