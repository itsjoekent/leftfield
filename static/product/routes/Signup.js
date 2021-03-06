import React from 'react';
import Select from 'react-select';
import { find, get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { FormWizardProvider, FormWizardFields } from 'pkg.form-wizard';
import VaultLayout from '@product/components/VaultLayout';
import { setToken } from '@product/features/auth';
import useProductApi from '@product/hooks/useProductApi';
import { DASHBOARD_CREATE_WEBSITE_ROUTE } from '@product/routes/Dashboard/CreateWebsite';
import { LOGIN_ROUTE } from '@product/routes/Login';

export const SIGNUP_ROUTE = '/signup';

export default function Signup() {
  const [formError, setFormError] = React.useState(null);
  const hitApi = useProductApi(false);

  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);

  function onSignup({ values }) {
    setIsLoading(true);
    setFormError(null);

    hitApi({
      method: 'post',
      route: '/signup',
      payload: values,
      options: { credentials: 'include' },
      onResponse: ({ ok, json }) => {
        setIsLoading(false);

        if (!ok || get(json, 'error')) {
          setFormError(get(json, 'error.message', 'Encountered error signing up, try again?'));
          return;
        }

        dispatch(setToken(get(json, 'token')));
        setLocation(DASHBOARD_CREATE_WEBSITE_ROUTE);
      },
      onFatalError: () => setIsLoading(false),
    });
  }

  const fields = [
    {
      id: 'organizationName',
      label: 'Organization Name',
      attributes: {
        htmlType: 'text',
      },
    },
    {
      id: 'organizationSize',
      label: 'Organization Size',
      attributes: {
        isSelect: true,
        options: [
          'Presidential Campaign',
          'Senate Campaign',
          'Congressional Campaign',
          'PAC, 501c4',
          'Non-Profit (501c3)',
          'State Party',
          'State-Wide Campaign',
          'State Legislature Campaign',
          'County-Wide Campaign',
          'Municipal Campaign',
          'Local Campaign',
        ].map((label) => ({ label, value: label })),
      },
    },
    {
      id: 'name',
      label: 'Name',
      attributes: {
        htmlType: 'text',
      },
    },
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
      title="Sign up"
      subtitle="Get started with Leftfield"
    >
      <FormWizardProvider
        name="signup"
        onFormSubmit={onSignup}
        fields={fields}
      >
        {({ formProps }) => (
          <Flex.Column
            as="form"
            gridGap="12px"
            {...formProps}
          >
            <FormWizardFields>
              {({
                field,
                value,
                setFieldValue,
                labelProps,
                inputProps,
                inputStylingProps,
              }) => (
                <Flex.Column key={field.id} gridGap="2px">
                  <Typography
                    as="label"
                    fontStyle="medium"
                    fontSize="14px"
                    fg={(colors) => colors.mono[700]}
                    {...labelProps}
                  />
                  {field.attributes.isSelect ? (
                    <Select
                      value={find(field.attributes.options, { value })}
                      options={field.attributes.options}
                      onChange={({ value }) => setFieldValue(value)}
                    />
                  ) : (
                    <Inputs.DefaultText
                      type={field.attributes.htmlType}
                      {...inputProps}
                      {...inputStylingProps}
                    />
                  )}
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
                Sign up
              </Typography>
            </Buttons.Filled>
          </Flex.Column>
        )}
      </FormWizardProvider>
      <Flex.Row
        align="center"
        justify="center"
        gridGap="6px"
        wrap="wrap"
      >
        <Typography
          fontStyle="regular"
          fontSize="14px"
          fg={(colors) => colors.mono[500]}
        >
          Already have an account?
        </Typography>
        <Buttons.Text
          as="a"
          href={LOGIN_ROUTE}
          buttonFg={(colors) => colors.blue[400]}
          hoverButtonFg={(colors) => colors.blue[700]}
        >
          <Typography
            fontStyle="regular"
            fontSize="14px"
          >
            Login
          </Typography>
        </Buttons.Text>
      </Flex.Row>
    </VaultLayout>
  );
}
