import React from 'react';
import { get } from 'lodash';
import { Link } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Icons,
  Inputs,
  Flex,
  Typography,
} from 'pkg.admin-components';
import {
  FormWizardProvider,
  FormWizardFields,
  formActions,
} from 'pkg.form-wizard';
import DashboardLayout from '@product/components/Dashboard/Layout';
import DashboardAccountAvatar from '@product/components/Dashboard/AccountAvatar';
import { setAccount, selectAuthAccount } from '@product/features/auth';
import { pushSnack } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';

export const DASHBOARD_ACCOUNT_ROUTE = '/dashboard/account';

export default function DashboardAccount() {
  const account = useSelector(selectAuthAccount);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const formApiRef = React.useRef(null);

  React.useEffect(() => {
    if (!formApiRef.current) {
      return;
    }

    const name = get(account, 'name', null);
    if (name !== get(formApiRef.current.getFormState(), 'values.name', null)) {
      formApiRef.current.dispatch(formActions.setValue('name', name));
    }

    const avatar = get(account, 'avatar', null);
    if (avatar !== get(formApiRef.current.getFormState(), 'values.avatar', null)) {
      formApiRef.current.dispatch(formActions.setValue('avatar', avatar));
    }
  }, [account]);

  function onProfileSave({ values }) {
    hitApi({
      method: 'put',
      route: '/profile',
      payload: values,
      onResponse: ({ json, ok }) => {
        if (ok) {
          dispatch(setAccount(json.account));
          dispatch(pushSnack({ message: 'Updated profile' }));
        }
      },
    });
  }

  return (
    <DashboardLayout>
      <Flex.Column
        fullWidth
        gridGap="24px"
        paddingTop="24px"
      >
        <Link href={DASHBOARD_ROUTE}>
          <Buttons.Text
            as="a"
            IconComponent={Icons.ArrowLeft}
            buttonFg={(colors) => colors.blue[700]}
            hoverButtonFg={(colors) => colors.mono[900]}
            gridGap="2px"
          >
            <Typography fontStyle="medium" fontSize="14px">
              Return to dashboard
            </Typography>
          </Buttons.Text>
        </Link>
        <Typography
          as="h2"
          fontStyle="bold"
          fontSize="24px"
          fg={(colors) => colors.mono[700]}
        >
          Edit your account
        </Typography>
        <FormWizardProvider
          name="profile"
          fields={[
            {
              id: 'avatar',
              label: 'Avatar',
            },
            {
              id: 'name',
              label: 'Name',
              validate: (value) => (!value || !value.length) && 'Name is required',
            },
          ]}
          onFormSubmit={onProfileSave}
          apiRef={formApiRef}
        >
          {({
            formProps,
            hasSubmittedOnce,
            submitButtonProps,
            validationMessages,
          }) => (
            <Flex.Column
              as="form"
              gridGap="12px"
              maxWidth="400px"
              {...formProps}
            >
              <FormWizardFields>
                {(field) => (
                  <Flex.Column gridGap="2px">
                    <Typography
                      as="label"
                      fontStyle="bold"
                      fontSize="14px"
                      letterSpacing="2%"
                      fg={(colors) => colors.mono[700]}
                      {...field.labelProps}
                    />
                    {field.id === 'avatar' ? (
                      <DashboardAccountAvatar
                        avatarSrc={field.value}
                        name={get(account, 'name')}
                        setAvatar={field.setFieldValue}
                      />
                    ) : (
                      <Inputs.DefaultText
                        {...field.inputProps}
                        {...field.inputStylingProps}
                      />
                    )}
                  </Flex.Column>
                )}
              </FormWizardFields>
              <Buttons.Filled
                fullWidth
                buttonFg={(colors) => colors.mono[100]}
                buttonBg={(colors) => colors.blue[500]}
                hoverButtonBg={(colors) => colors.blue[700]}
                paddingVertical="4px"
                paddingHorizontal="8px"
                {...submitButtonProps}
              >
                <Typography fontStyle="medium" fontSize="14px">
                  Save profile
                </Typography>
              </Buttons.Filled>
              {!!validationMessages.length && hasSubmittedOnce && (
                <Typography
                  fontStyle="regular"
                  fontSize="14px"
                  fg={(colors) => colors.red[500]}
                >
                  {validationMessages.join(', ')}
                </Typography>
              )}
            </Flex.Column>
          )}
        </FormWizardProvider>
      </Flex.Column>
    </DashboardLayout>
  );
}
