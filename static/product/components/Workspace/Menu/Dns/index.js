import React from 'react';
import { findIndex, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Inputs,
  Tooltip,
  Typography,
  useAdminTheme,
} from 'pkg.admin-components';
import { FormWizardProvider, FormWizardField } from 'pkg.form-wizard';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import { selectWebsiteId } from '@product/features/assembly';
import { setModal, POST_ADD_DOMAIN_MODAL } from '@product/features/modal';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';

// Adapted from here,
// https://stackoverflow.com/a/14646633
function isValidDomain(domain) {
  const regex = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
  return regex.test(domain);
}

export default function Dns(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  const [domains, setDomains] = React.useState(null);
  const [isAddingDomain, setIsAddingDomain] = React.useState(false);
  const [isRemovingDomain, setIsRemovingDomain] = React.useState({});
  const [isVerifyingDomain, setIsVeryifyingDomain] = React.useState({});

  const dispatch = useDispatch();
  const hitApi = useProductApi();
  const adminTheme = useAdminTheme();

  const websiteId = useSelector(selectWebsiteId);

  function updateDomain(domainRecord) {
    setDomains((domains) => {
      const index = findIndex(domains, { id: get(domainRecord, 'id') });

      if (index < 0) {
        return domains;
      }

      const copy = [...domains];
      copy[index] = domainRecord;
      return copy;
    });
  }

  React.useEffect(() => {
    if (!isExpanded) {
      return;
    }

    let cancel = false;

    hitApi({
      method: 'get',
      route: `/website/${websiteId}`,
      onResponse: ({ json, ok }) => {
        if (ok && !cancel) {
          setDomains(get(json, 'website.domains', []));
        }
      },
    });

    return () => cancel = true;
  }, [isExpanded, websiteId]);

  function onAddDomain(submission) {
    const { values: { name } } = submission;
    setIsAddingDomain(true);

    const normalizedName = name
      .toLowerCase()
      .replace('www.', '')
      .replace('http://', '')
      .replace('https://', '');

    hitApi({
      method: 'post',
      route: `/website/${websiteId}/dns`,
      payload: { name: normalizedName },
      onResponse: ({ json, ok }) => {
        setIsAddingDomain(false);

        if (ok) {
          setDomains(get(json, 'website.domains', []));

          const domainRecordId = get(json, 'domainRecord.id');

          dispatch(setModal({
            type: POST_ADD_DOMAIN_MODAL,
            props: {
              domainRecordId,
              updateDomain,
            },
          }));
        }
      },
      onFatalError: () => setIsAddingDomain(false),
    });
  }

  function removeDomain(id) {
    setIsRemovingDomain((copy) => ({
      ...copy,
      [id]: true,
    }));

    hitApi({
      method: 'delete',
      route: `/website/${websiteId}/dns/${id}`,
      onResponse: ({ ok, json }) => {
        setIsRemovingDomain((copy) => ({
          ...copy,
          [id]: false,
        }));

        if (ok) {
          setDomains(get(json, 'website.domains', []));
        }
      },
      onFatalError: () => setIsRemovingDomain((copy) => ({
        ...copy,
        [id]: false,
      })),
    });
  }

  function verifyDomain(id) {
    setIsVeryifyingDomain((copy) => ({
      ...copy,
      [id]: true,
    }));

    hitApi({
      method: 'post',
      route: `/dns/${id}/verify`,
      onResponse: ({ ok, json }) => {
        setIsVeryifyingDomain((copy) => ({
          ...copy,
          [id]: false,
        }));

        if (ok) {
          updateDomain(get(json, 'domainRecord'));

          if (!get(json, 'verified', false)) {
            dispatch(pushSnack({
              message: 'Failed to verify DNS record, try again in a few seconds',
              type: SPICY_SNACK,
            }));
          }
        }
      },
      onFatalError: () => setIsVeryifyingDomain((copy) => ({
        ...copy,
        [id]: false,
      })),
    });
  }

  return (
    <WorkspaceMenuAccordion
      title="DNS"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
      <Flex.Column gridGap="24px">
        <FormWizardProvider
          name="dns"
          fields={[
            {
              id: 'name',
              label: 'Domain Name',
              placeholder: 'leftyforcongress.com',
              validate: (name) => {
                if (!name || !name.length) {
                  return 'Missing domain name';
                }

                if (!isValidDomain(name)) {
                  return 'Invalid domain name';
                }

                return true;
              },
            },
          ]}
          onFormSubmit={onAddDomain}
        >
          {({
            formProps,
            hasSubmittedOnce,
            submitButtonProps,
            validationMessages,
          }) => (
            <Flex.Column as="form" gridGap="2px" {...formProps}>
              <FormWizardField fieldId="name">
                {({
                  field,
                  labelProps,
                  inputProps,
                  inputStylingProps,
                }) => (
                  <Flex.Column gridGap="2px">
                    <Typography
                      as="label"
                      fontStyle="medium"
                      fontSize="14px"
                      fg={(colors) => colors.mono[700]}
                      {...labelProps}
                    />
                    <Flex.Row
                      align="center"
                      justify="space-between"
                      gridGap="6px"
                    >
                      <Inputs.DefaultText
                        flexGrow
                        {...inputProps}
                        {...inputStylingProps}
                      />
                      <Buttons.Filled
                        {...submitButtonProps}
                        fitWidth
                        buttonFg={(colors) => colors.mono[100]}
                        buttonBg={(colors) => colors.blue[500]}
                        hoverButtonBg={(colors) => colors.blue[700]}
                        paddingVertical="4px"
                        paddingHorizontal="8px"
                        isLoading={false}
                      >
                        <Typography fontStyle="medium" fontSize="14px">
                          Add Domain
                        </Typography>
                      </Buttons.Filled>
                    </Flex.Row>
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
              </FormWizardField>
            </Flex.Column>
          )}
        </FormWizardProvider>
        <Flex.Column gridGap="6px">
          <Typography
            as="h3"
            fontStyle="bold"
            fontSize="16px"
            fg={(colors) => colors.mono[700]}
          >
            Domains
          </Typography>
          {Array.isArray(domains) && !!domains.length && (
            <Flex.Column>
              {domains.map((domain, index) => (
                <Flex.Row
                  key={domain.id}
                  align="center"
                  justify="space-between"
                  bg={(colors) => colors.mono[!!(index % 2) ? 100 : 200]}
                  rounded={(radius) => radius.default}
                  padding="8px"
                >
                  <Flex.Row gridGap="4px" align="center">
                    {get(domain, 'verified', false) ? (
                      <Icons.DoneRound
                        width={20}
                        height={20}
                        color={adminTheme.colors.blue[500]}
                      />
                    ) : (
                      <Icons.Sad
                        width={20}
                        height={20}
                        color={adminTheme.colors.red[500]}
                      />
                    )}
                    <Typography
                      fontStyle="medium"
                      fontSize="14px"
                      fg={(colors) => colors.mono[700]}
                    >
                      {get(domain, 'name')}
                    </Typography>
                  </Flex.Row>
                  <Flex.Row gridGap="6px">
                    {!get(domain, 'verified', false) && (
                      <Tooltip copy="Verify domain" point={Tooltip.UP_RIGHT_ALIGNED}>
                        <Buttons.IconButton
                          IconComponent={Icons.Refresh2}
                          color={(colors) => colors.mono[600]}
                          hoverColor={(colors) => colors.mono[900]}
                          aria-label="Verify domain"
                          disabled={get(isVerifyingDomain, domain.id, false)}
                          onClick={() => verifyDomain(domain.id)}
                        />
                      </Tooltip>
                    )}
                    <Tooltip copy="Remove domain" point={Tooltip.UP_RIGHT_ALIGNED}>
                      <Buttons.IconButton
                        IconComponent={Icons.RemoveFill}
                        color={(colors) => colors.mono[600]}
                        hoverColor={(colors) => colors.red[500]}
                        aria-label="Remove domain"
                        disabled={get(isRemovingDomain, domain.id, false)}
                        onClick={() => removeDomain(domain.id)}
                      />
                    </Tooltip>
                  </Flex.Row>
                </Flex.Row>
              ))}
            </Flex.Column>
          )}
          {Array.isArray(domains) && !domains.length && (
            <Typography fontSize="16px" fg={(colors) => colors.mono[700]}>
              No domains registered
            </Typography>
          )}
          {domains === null && (
            <Block
              fullWidth
              specificHeight="32px"
              bg={(colors) => colors.mono[200]}
            />
          )}
        </Flex.Column>
      </Flex.Column>
    </WorkspaceMenuAccordion>
  );
}
