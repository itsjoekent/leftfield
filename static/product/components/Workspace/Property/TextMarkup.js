import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import RichText, { BLANK_DEFAULT } from '@product/components/RichText';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';

export default function TextMarkup(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const getPropertyValue = useGetPropertyValue(activePageId, activeComponentId);

  const inheritedFrom = useSelector(selectComponentPropertyInheritedFromForLanguage(
    activePageId,
    activeComponentId,
    propertyId,
    language,
  ));

  const field = useFormField(fieldId);
  const richTextRef = React.useRef(null);

  const content = isDefined(inheritedFrom)
    ? getPropertyValue(propertyId, language)
    : get(field, 'value', '');

  React.useEffect(() => {
    if (!richTextRef.current) {
      return;
    }

    const blankStringified = JSON.stringify(BLANK_DEFAULT);
    const valueStringified = JSON.stringify(richTextRef.current.value);

    const isBlank = valueStringified === blankStringified;
    const isContentBlank = content === blankStringified;

    if (
      !!inheritedFrom
      || (!!content && isBlank && !isContentBlank)
      || (!!content && valueStringified !== content)
    ) {
      richTextRef.current.setValue(JSON.parse(content));
    }
  }, [
    content,
    inheritedFrom,
  ]);

  function onChange(value) {
    if (field) {
      field.setFieldValue(JSON.stringify(value));
    }
  }

  return (
    <RichText
      apiRef={richTextRef}
      hideMarks={get(property, 'hideMarks', false)}
      inlineOnly={get(property, 'inlineOnly', false)}
      onChange={onChange}
    />
  );
}
