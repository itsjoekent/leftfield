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
    const isBlank = JSON.stringify(richTextRef.current.value) === blankStringified;
    const isContentBlank = content === blankStringified;

    if (inheritedFrom || (!!content && isBlank && !isContentBlank)) {
      richTextRef.current.setValue(JSON.parse(content));
    }
  }, [
    content,
    inheritedFrom,
  ]);

  React.useEffect(() => {
    if (richTextRef.current && !!activeComponentId) {
      richTextRef.current.setValue(BLANK_DEFAULT);
    }
  }, [
    activeComponentId,
  ]);

  function onChange(value) {
    if (field) {
      field.setFieldValue(JSON.stringify(value));
    }
  }

  return (
    <RichText
      onChange={onChange}
      apiRef={richTextRef}
    />
  );
}
