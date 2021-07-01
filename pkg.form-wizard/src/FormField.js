import React from 'react';
import useFormField from '@fw/useFormField';

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
