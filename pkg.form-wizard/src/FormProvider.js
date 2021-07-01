import React from 'react';
import produce from 'immer';
import FormContext, { initialFormContextValue } from '@fw/FormContext';

export default function FormProvider(props) {
  const {
    name = initialFormContextValue.formName,
    children: formRenderFunction,
    fields = initialFormContextValue.fields,
    hasAutoSave = initialFormContextValue.hasAutoSave,
    onFormSubmit = initialFormContextValue.onFormSubmit,
    onFieldSave = initialFormContextValue.onFieldSave,
  } = props;

  function formReducer(state, action) {
    const next = produce(state, action(state));
    return next;
  }

  const [form, dispatch] = React.useReducer(
    formReducer,
    initialFormContextValue,
  );

  const contextValue = {
    ...form,
    formName: name,
    fields,
    dispatch,
    hasAutoSave,
    onFormSubmit,
    onFieldSave,
  };

  function providerFormOnSubmit(event) {
    event.preventDefault();

    if (onFormSubmit) {
      onFormSubmit({
        values: form.values,
      });
    }
  }

  return (
    <FormContext.Provider value={contextValue}>
      {formRenderFunction({
        formProps: {
          id: `form-${name}`,
          onSubmit: providerFormOnSubmit,
        },
      })}
    </FormContext.Provider>
  );
}
