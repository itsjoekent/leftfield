import React from 'react';
import FormWizardField from '@fw/FormField';
import { useFormContext } from '@fw/FormContext';

export default function FormFields(props) {
  const { children: fieldRenderFunction } = props;
  const { fields } = useFormContext();

  if (!fields) {
    return null;
  }

  return fields.map((field, index) => (
    <FormWizardField fieldId={field.id} key={`${field.id}-${index}`}>
      {fieldRenderFunction}
    </FormWizardField>
  ));
}
