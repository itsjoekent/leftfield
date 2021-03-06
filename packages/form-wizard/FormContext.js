import React from 'react';

export const initialFormContextValue = {
  formName: '',
  fields: [],
  values: {},
  isFocused: {},
  validations: {},
  hasSubmittedOnce: false,
  dispatch: () => {},
  onFormSubmit: () => {},
  onFieldSave: () => {},
};

const FormContext = React.createContext(initialFormContextValue);

export function useFormContext() {
  return React.useContext(FormContext);
}

export default FormContext;
