import React from 'react';
import qs from 'qs';
import { get, isEmpty } from 'lodash';
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
import { pushSnack } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';
import { LOGIN_ROUTE } from '@product/routes/Login';
import { SIGNUP_ROUTE } from '@product/routes/Signup';

export const RESET_PASSWORD_ROUTE = '/reset-password';

export default function ResetPassword() {
  const [formError, setFormError] = React.useState(null);
  const hitApi = useProductApi(false);

  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);
  const [disableSubmit, setDisableSubmit] = React.useState(false);

  const [query, setQuery] = React.useState(qs.parse(window.location.search.slice(1)));
  const isRequestingReset = isEmpty(query) || !get(query, 'id', null);

  function onReset({ values }) {
    const { password } = values;
    setIsLoading(true);

    const { id, token } = query;

    hitApi({
      method: 'post',
      route: '/reset-password',
      payload: { id, password, token },
      options: { credentials: 'include' },
      onResponse: ({ json, ok }) => {
        setIsLoading(false);

        if (!ok || get(json, 'error')) {
          setFormError(get(json, 'error.message', 'Encountered error resetting password, try again?'));
          return;
        }

        batch(() => {
          dispatch(setAccount(get(json, 'account')));
          dispatch(setToken(get(json, 'token')));
        });

        setLocation(DASHBOARD_ROUTE);
      },
      onFatalError: () => setIsLoading(false),
    });
  }

  function requestReset({ values }) {
    const { email } = values;
    setIsLoading(true);

    hitApi({
      method: 'post',
      route: '/request-password-reset',
      payload: { email },
      onResponse: ({ json, ok }) => {
        setIsLoading(false);

        if (!ok || get(json, 'error')) {
          setFormError(get(json, 'error.message', 'Encountered error requesting password reset, try again?'));
          return;
        }

        setDisableSubmit(true);
        dispatch(pushSnack({
          message: 'Password reset email sent, check your inbox!',
        }));
      },
      onFatalError: () => setIsLoading(false),
    });
  }

  const fields = isRequestingReset ? [
    {
      id: 'email',
      label: 'Email',
      attributes: {
        htmlType: 'email',
      },
    },
  ] : [
    {
      id: 'password',
      label: 'New Password',
      attributes: {
        htmlType: 'password',
      },
    },
  ];

  return (
    <VaultLayout title="Reset your password">
      <FormWizardProvider
        name="reset-password"
        onFormSubmit={isRequestingReset ? requestReset : onReset}
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
              disabled={disableSubmit}
              fullWidth
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.blue[500]}
              hoverButtonBg={(colors) => colors.blue[700]}
              paddingVertical="4px"
              paddingHorizontal="8px"
              isLoading={isLoading}
            >
              <Typography fontStyle="medium" fontSize="14px">
                {isRequestingReset ? 'Request password reset' : 'Reset password'}
              </Typography>
            </Buttons.Filled>
          </Flex.Column>
        )}
      </FormWizardProvider>
      {isRequestingReset && (
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
          <Link href={LOGIN_ROUTE}>
            <Buttons.Text
              as="a"
              buttonFg={(colors) => colors.blue[400]}
              hoverButtonFg={(colors) => colors.blue[700]}
            >
              <Typography
                fontStyle="regular"
                fontSize="14px"
              >
                Log in
              </Typography>
            </Buttons.Text>
          </Link>
        </Flex.Row>
      )}
    </VaultLayout>
  );
}
