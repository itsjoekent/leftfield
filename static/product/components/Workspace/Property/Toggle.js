import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';

export default function Toggle(props) {
  const { fieldId, language, property } = props;
  const propertyId = get(property, 'id');

  const { activePageRoute, activeComponentId } = useActiveWorkspaceComponent();

  const getPropertyValue = useGetPropertyValue(activePageRoute, activeComponentId);

  const inheritedFrom = useSelector(selectComponentPropertyInheritedFromForLanguage(
    activePageRoute,
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
