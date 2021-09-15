import React from 'react';
import { get } from 'lodash';
import { batch, useDispatch } from 'react-redux';
import { Link, useLocation } from 'wouter';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { FormWizardProvider, FormWizardFields } from 'pkg.form-wizard';
import VaultLayout from '@product/components/VaultLayout';
import { setAccount, setToken } from '@product/features/auth';
import useProductApi from '@product/hooks/useProductApi';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';
import { RESET_PASSWORD_ROUTE } from '@product/routes/ResetPassword';
import { SIGNUP_ROUTE } from '@product/routes/Signup';

export const LOGIN_ROUTE = '/login';

export default function Login() {
  const [formError, setFormError] = React.useState(null);
  const hitApi = useProductApi(false);

  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);

  function onLogin({ values }) {
    const { email, password } = values;
    setIsLoading(true);

    hitApi({
      method: 'post',
      route: '/login',
      payload: { email, password },
      options: { credentials: 'include' },
      onResponse: ({ status, json }) => {
        if (get(json, 'error')) {
          setIsLoading(false);
          setFormError(get(json, 'error.message', 'Encountered error logging in, try again?'));
          return;
        }

        batch(() => {
          dispatch(setAccount(get(json, 'account')));
          dispatch(setToken(get(json, 'token')));
        });

        setTimeout(() => setLocation(DASHBOARD_ROUTE), 500);
      },
      onFatalError: () => setIsLoading(false),
    });
  }

  const fields = [
    {
      id: 'email',
      label: 'Email',
      attributes: {
        htmlType: 'email',
      },
    },
    {
      id: 'password',
      label: 'Password',
      attributes: {
        htmlType: 'password',
      },
    },
  ];

  return (
    <VaultLayout
      title="Welcome back"
      subtitle="Log in to your Leftfield account."
    >
      <FormWizardProvider
        name="login"
        onFormSubmit={onLogin}
        fields={fields}
      >
        {({ formProps }) => (
          <Flex.Column
            as="form"
            gridGap="12px"
            {...formProps}
          >
            <FormWizardFields>
              {({ field, labelProps, inputProps, inputStylingProps }) => (
                <Flex.Column key={field.id} gridGap="2px">
                  <Typography
                    as="label"
                    fontStyle="medium"
                    fontSize="14px"
                    fg={(colors) => colors.mono[700]}
                    {...labelProps}
                  />
                  <Inputs.DefaultText
                    type={field.attributes.htmlType}
                    {...inputProps}
                    {...inputStylingProps}
                  />
                </Flex.Column>
              )}
            </FormWizardFields>
            {!!formError && (
              <Typography
                fontStyle="medium"
                fontSize="14px"
                fg={(colors) => colors.red[500]}
              >
                {formError}
              </Typography>
            )}
            <Buttons.Filled
              type="submit"
              fullWidth
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.blue[500]}
              hoverButtonBg={(colors) => colors.blue[700]}
              paddingVertical="4px"
              paddingHorizontal="8px"
              isLoading={isLoading}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Log in
              </Typography>
            </Buttons.Filled>
          </Flex.Column>
        )}
      </FormWizardProvider>
      <Flex.Row justify="space-around" wrap="wrap">
        <Link href={SIGNUP_ROUTE}>
          <Buttons.Text
            as="a"
            buttonFg={(colors) => colors.blue[400]}
            hoverButtonFg={(colors) => colors.blue[700]}
          >
            <Typography
              fontStyle="regular"
              fontSize="14px"
            >
              Create new account
            </Typography>
          </Buttons.Text>
        </Link>
        <Link href={RESET_PASSWORD_ROUTE}>
          <Buttons.Text
            as="a"
            buttonFg={(colors) => colors.blue[400]}
            hoverButtonFg={(colors) => colors.blue[700]}
          >
            <Typography
              fontStyle="regular"
              fontSize="14px"
            >
              Forgot Password
            </Typography>
          </Buttons.Text>
        </Link>
      </Flex.Row>
    </VaultLayout>
  );
}
