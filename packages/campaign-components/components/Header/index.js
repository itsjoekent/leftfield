import React from 'react';
import get from 'lodash/get';
import useLanguage from 'pkg.campaign-components/hooks/useLanguage';
import getPropertyValue from 'pkg.campaign-components/utils/getPropertyValue';
import serializeRichText from 'pkg.campaign-components/utils/serializeRichText';

export const TAG = 'Header';

export const COPY_PROPERTY = 'COPY_PROPERTY';
export const LEVEL_PROPERTY = 'LEVEL_PROPERTY';

export const HEADER_STYLE = 'HEADER_STYLE';

export default function Header(props) {
  const { componentClassName, properties } = props;

  const language = useLanguage();

  const level = getPropertyValue(properties, LEVEL_PROPERTY) || 1;

  const richText = getPropertyValue(properties, COPY_PROPERTY, language) || '';
  const html = serializeRichText({ value: richText, inline: true });

  const headerProps = {
    className: componentClassName,
    dangerouslySetInnerHTML: { __html: html },
  };

  return React.createElement(`h${level}`, headerProps);
}
