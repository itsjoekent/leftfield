import React from 'react';
import produce from 'immer';
import FormContext, { initialFormContextValue } from 'pkg.form-wizard/FormContext';

export default function FormProvider(props) {
  const {
    name = initialFormContextValue.formName,
    children: formRenderFunction,
    fields = initialFormContextValue.fields,
    onFormSubmit = initialFormContextValue.onFormSubmit,
    onFieldSave = initialFormContextValue.onFieldSave,
    apiRef = null,
  } = props;

  function formReducer(state, action) {
    const next = produce(state, (draft) => action(draft));
    return next;
  }

  const [form, dispatch] = React.useReducer(
    formReducer,
    initialFormContextValue,
  );

  React.useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        dispatch,
        getFormState: () => form,
      };
    }
  }, [
    apiRef,
    dispatch,
    form,
  ]);

  const contextValue = {
    ...form,
    formName: name,
    fields,
    dispatch,
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
