import React from 'react';
import get from 'lodash.get';
import {
  setValue,
  setIsFocused,
} from '@fw/actions';
import { useFormContext } from '@fw/FormContext';

export default function FormField(props) {
  const {
    children: fieldRenderFunction,
    fieldId,
  } = props;

  const {
    formName,
    fields,
    values,
    isFocused,
    validations,
    hasAutoSave,
    dispatch,
    onFieldSave,
  } = useFormContext();

  const field = fields.find((compare) => compare.id === fieldId);
  if (!field) {
    return null;
  }

  const value = get(values, fieldId, '');

  const inputHtmlId = `${formName}-${fieldId}-input`;
  const labelHtmlId = `${formName}-${fieldId}-label`;

  const inputProps = {
    id: inputHtmlId,
    'aria-labelledby': labelHtmlId,
    value,
    onChange: (event) => dispatch(setValue(fieldId, event.target.value)),
    onFocus: () => dispatch(setIsFocused(fieldId, true)),
    onBlur: () => dispatch(setIsFocused(fieldId, false)),
  };

  const labelProps = {
    id: labelHtmlId,
    htmlFor: inputHtmlId,
    children: field.label,
  };

  return fieldRenderFunction({
    inputProps,
    labelProps,
    field,
    value,
  });
}
