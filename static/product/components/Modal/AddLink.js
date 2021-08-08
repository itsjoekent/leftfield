import React from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import {
  FormWizardProvider,
  FormWizardFields,
  formActions,
} from 'pkg.form-wizard';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { closeModal } from '@product/features/modal';
import isTrue from '@product/utils/isTrue';

export default function AddLink(props) {
  const {
    href = '',
    openInNewTab = false,
    includeTextField = false,
    includeNewTabField = false,
    onInsert,
  } = props;

  const isEditing = !!href
  const title = isEditing ? 'Edit link' : 'Insert link';

  const [validationError, setValidationError] = React.useState(null);

  const dispatch = useDispatch();

  const onSave = React.useCallback(({ values }) => {
    if (!values.href) {
      setValidationError('Missing link target');
      return;
    }

    onInsert(values);
    dispatch(closeModal());
  }, [includeTextField]);

  const formApiRef = React.useRef(null);

  React.useEffect(() => {
    if (!formApiRef.current) {
      return;
    }

    if (href !== get(formApiRef.current.getFormState(), 'values.href', null)) {
      formApiRef.current.dispatch(formActions.setValue('href', href));
    }

    if (openInNewTab !== get(formApiRef.current.getFormState(), 'values.openInNewTab', false)) {
      formApiRef.current.dispatch(formActions.setValue('openInNewTab', openInNewTab));
    }
  }, [
    href,
    openInNewTab,
  ]);

  const fields = [];

  if (includeTextField) {
    fields.push({ id: 'text', label: 'Link text' });
  }

  fields.push({ id: 'href', label: 'Link target', placeholder: 'https://iwillvote.org' });

  if (includeNewTabField) {
    fields.push({ id: 'openInNewTab', label: 'Open New Tab' });
  }

  return (
    <ModalDefaultLayout title={title} width="400px">
      <FormWizardProvider
        name="link"
        fields={fields}
        onFormSubmit={onSave}
        apiRef={formApiRef}
      >
        {({ formProps }) => (
          <Flex.Column
            as="form"
            padding="12px"
            gridGap="12px"
            bg={(colors) => colors.mono[100]}
            {...formProps}
          >
            <FormWizardFields>
              {(field) => field.id === 'openInNewTab' ? (
                <Flex.Row
                  gridGap="2px"
                  paddingVertical="2px"
                  onClick={() => field.setFieldValue(!field.value)}
                >
                  <input
                    type="checkbox"
                    checked={isTrue(field.value)}
                    {...field.inputProps}
                  />
                  <Typography
                    as="label"
                    fontStyle="regular"
                    fontSize="14px"
                    fg={(colors) => colors.mono[700]}
                    {...field.labelProps}
                  />
                </Flex.Row>
              ) : (
                <Flex.Column gridGap="2px">
                  <Typography
                    as="label"
                    fontStyle="bold"
                    fontSize="14px"
                    letterSpacing="2%"
                    fg={(colors) => colors.mono[700]}
                    {...field.labelProps}
                  />
                  <Inputs.DefaultText
                    {...field.inputProps}
                    {...field.inputStylingProps}
                  />
                </Flex.Column>
              )}
            </FormWizardFields>
            <Buttons.Filled
              type="submit"
              paddingVertical="4px"
              paddingHorizontal="8px"
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.blue[500]}
              hoverButtonBg={(colors) => colors.blue[700]}
            >
              <Typography fontStyle="medium" fontSize="16px">
                {!!isEditing ? 'Update link' : 'Insert link'}
              </Typography>
            </Buttons.Filled>
            {!!validationError && (
              <Typography
                fontStyle="regular"
                fontSize="12px"
                fg={(colors) => colors.red[500]}
              >
                {validationError}
              </Typography>
            )}
          </Flex.Column>
        )}
      </FormWizardProvider>
    </ModalDefaultLayout>
  );
}
