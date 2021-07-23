import React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { FormWizardProvider, FormWizardFields } from 'pkg.form-wizard';
import { setToken } from '@product/features/auth';
import useProductApi from '@product/hooks/useProductApi';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';
import { SIGNUP_ROUTE } from '@product/routes/Signup';

export const LOGIN_ROUTE = '/login';

export default function Login() {
  const [formError, setFormError] = React.useState(null);
  const hitApi = useProductApi(false);

  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  function onLogin({ values }) {
    const { email, password } = values;

    hitApi('post', 'login', { email, password }, ({ status, json }) => {
      if (get(json, 'error')) {
        setFormError(get(json, 'error.message', 'Encountered error logging in, try again?'));
        return;
      }

      dispatch(setToken(get(json, 'token')));
      setLocation(DASHBOARD_ROUTE);
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
    <Flex.Column
      fullWidth
      fullViewportHeight
      bg={(colors) => colors.mono[200]}
      justify="center"
      align="center"
      padding="24px"
    >
      <Flex.Column
        gridGap="24px"
        fullWidth
        maxWidth="400px"
        padding="24px"
        bg={(colors) => colors.mono[100]}
        rounded={(radius) => radius.default}
        shadow={(shadows) => shadows.light}
      >
        <Flex.Column gridGap="2px">
          <Typography
            as="h1"
            fontStyle="bold"
            fontSize="22px"
            fg={(colors) => colors.blue[600]}
            textAlign="center"
          >
            Welcome back
          </Typography>
          <Typography
            as="h2"
            fontStyle="medium"
            fontSize="16px"
            fg={(colors) => colors.mono[500]}
            textAlign="center"
          >
            Log in to your Leftfield account.
          </Typography>
        </Flex.Column>
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
              >
                <Typography fontStyle="medium" fontSize="14px">
                  Log in
                </Typography>
              </Buttons.Filled>
            </Flex.Column>
          )}
        </FormWizardProvider>
        <Flex.Row justify="space-around" wrap="wrap">
          <Buttons.Text
            as="a"
            href={SIGNUP_ROUTE}
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
        </Flex.Row>
      </Flex.Column>
    </Flex.Column>
  );
}
