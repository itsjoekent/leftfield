<FormWizard name="" fields={[]}>
  {(formProps) => (
    <StyledForm {...formProps}>
      <FormWizardFields>
        {(field) => (
          <div>
            <label {...field.labelProps} />
            <input {...field.inputProps} />
            {!field.isValid && (
              <p>{field.validationMessages[0]}</p>
            )}
          </div>
        )}
      </FormWizardFields>
    </StyledForm>
  )}
</FormWizard>
