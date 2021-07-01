import get from 'lodash.get';
import { useFormContext } from '@fw/FormContext';
import {
  setValue,
  setIsFocused,
} from '@fw/actions';

export default function useFormField(fieldId) {
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

  const inputStylingProps = {
    isFocused: get(isFocused, fieldId, false),
  };

  return {
    inputProps,
    inputStylingProps,
    labelProps,
    field,
    value,
  };
}
