import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@editor/hooks/useGetPropertyValue';
import isDefined from '@editor/utils/isDefined';


export default function Toggle(props) {
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

  if (!field) {
    return null;
  }

  const {
    setFieldValue,
    value,
  } = field;

  const finalValue = isDefined(inheritedFrom)
    ? getPropertyValue(propertyId, language)
    : value;

  return (
    <Inputs.Toggle
      labelledBy={`${propertyId}-${Languages.US_ENGLISH_LANG}`}
      value={!!finalValue}
      setValue={setFieldValue}
      isDisabled={!!inheritedFrom}
    />
  );
}
