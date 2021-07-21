import React from 'react';
import useFormField from 'pkg.form-wizard/useFormField';

export default function FormField(props) {
  const {
    children: fieldRenderFunction,
    fieldId,
  } = props;

  const fieldData = useFormField(fieldId);
  if (!fieldData) {
    return null;
  }

  return fieldRenderFunction(fieldData);
}
