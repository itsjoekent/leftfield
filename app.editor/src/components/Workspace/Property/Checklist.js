import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import { selectComponentPropertyInheritedFromForLanguage } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useDynamicEvaluation from '@editor/hooks/useDynamicEvaluation';

export default function Checklist(props) {
  const { fieldId, language, property } = props;
  const propertyId = get(property, 'id');

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const { evaluateDynamicPropertyAttribute } = useDynamicEvaluation(activePageId, activeComponentId);

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

  const hasDynamicOptions = !!get(property, 'dynamicOptions');
  const dynamicOptions = hasDynamicOptions ? evaluateDynamicPropertyAttribute(property, 'dynamicOptions') : [];

  const options = get(property, 'options') || dynamicOptions || [];

  return (
    <Inputs.Checklist
      fieldId={fieldId}
      labelledBy={`${propertyId}-${Languages.US_ENGLISH_LANG}`}
      value={value}
      options={options}
      setValue={setFieldValue}
      isDisabled={!!inheritedFrom}
    />
  );
}
