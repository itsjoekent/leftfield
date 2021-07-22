import React from 'react';
import { get } from 'lodash';
import { useFormField } from 'pkg.form-wizard';
import WorkspaceFieldLabel from '@product/components/Workspace/FieldLabel';

export default function Label(props) {
  const { fieldId, property } = props;
  const field = useFormField(fieldId);

  if (!field) {
    return null;
  }

  const { labelProps } = field;

  return (
    <WorkspaceFieldLabel
      isRequired={get(property, 'required', false)}
      help={get(property, 'help', null)}
      labelProps={labelProps}
    />
  );
}
