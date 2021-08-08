import React from 'react';
import produce from 'immer';
import get from 'lodash/get';
import FormContext, { initialFormContextValue } from 'pkg.form-wizard/FormContext';
import { setHasSubmittedOnce, setValidation } from 'pkg.form-wizard/actions';

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

  const { hasSubmittedOnce, validations, values } = form;

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

  React.useEffect(() => {
    (fields || []).forEach((field) => {
      const validate = get(field, 'validate', null);

      if (validate) {
        const fieldId = get(field, 'id');
        const validation = validate(get(values, fieldId));

        if (validation !== get(validations, fieldId)) {
          dispatch(setValidation(fieldId, validation));
        }
      }
    });
  }, [
    JSON.stringify(fields),
    validations,
    values,
  ]);

  const contextValue = {
    ...form,
    formName: name,
    fields,
    dispatch,
    onFormSubmit,
    onFieldSave,
  };

  const validationMessages = Object.values(validations)
    .filter((validation) => typeof validation === 'string' && !!validation.length);

  const submitButtonProps = {
    type: 'submit',
    disabled: !!validationMessages.length,
  };

  function providerFormOnSubmit(event) {
    event.preventDefault();

    if (!hasSubmittedOnce) {
      dispatch(setHasSubmittedOnce(true));
    }

    if (onFormSubmit) {
      onFormSubmit({ values });
    }
  }

  return (
    <FormContext.Provider value={contextValue}>
      {formRenderFunction({
        formProps: {
          id: `form-${name}`,
          onSubmit: providerFormOnSubmit,
        },
        hasSubmittedOnce,
        submitButtonProps,
        validationMessages,
      })}
    </FormContext.Provider>
  );
}
