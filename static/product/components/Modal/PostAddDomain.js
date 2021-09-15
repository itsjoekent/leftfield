import React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import ClickToCopy from '@product/components/ClickToCopy';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { closeModal } from '@product/features/modal';
import useProductApi from '@product/hooks/useProductApi';

// TODO: Push snack on verify

export default function PostAddDomain(props) {
  const { domainName, domainRecordId, updateDomain } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [failedValidation, setFailedValidation] = React.useState(false);

  const [records, setRecords] = React.useState(null);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  React.useEffect(() => {
    let cancel = false;

    hitApi({
      method: 'get',
      route: '/dns/records',
      onResponse: ({ ok, json }) => {
        if (ok) {
          let records = get(json, 'records', [])
            .map((record) => ({ ...record, name: domainName }));

          if (domainName.split('.').length === 2) {
            records = records.concat(records.map((record) => ({
              ...record,
              name: `www.${record.name}`,
            })));
          }

          setRecords(records);
        }
      },
    });

    return () => cancel = true;
  }, [domainName]);

  async function verifyDns() {
    setIsLoading(true);
    setFailedValidation(false);

    hitApi({
      method: 'post',
      route: `/dns/${domainRecordId}/verify`,
      onResponse: ({ ok, json }) => {
        setIsLoading(false);

        if (ok) {
          const verified = get(json, 'verified', false);

          if (verified) {
            updateDomain(get(json, 'domainRecord'));
            dispatch(closeModal());
          } else {
            setFailedValidation(true);
          }
        }
      },
      onFatalError: () => setIsLoading(false),
    });
  }

  return (
    <ModalDefaultLayout title="Configure your domain" width="400px">
      <Flex.Column
        gridGap="24px"
        padding="24px"
        fullWidth
        bg={(colors) => colors.mono[100]}
      >
        <Typography fontSize="16px" fg={(colors) => colors.mono[700]}>
          Go to your domain registrar and add the following DNS records,
        </Typography>
        <Flex.Column gridGap="6px">
          {!!records && records.map((record) => (
            <Flex.Row
              fullWidth
              align="center"
              bg={(colors) => colors.mono[200]}
              key={`${get(record, 'ip')}-${get(record, 'name')}`}
            >
              <Block
                fitWidth
                padding="12px"
                borderRightWidth="2px"
                borderColor={(colors) => colors.mono[400]}
              >
                <Typography
                  as="span"
                  fontSize="14px"
                  fontStyle="medium"
                  fg={(colors) => colors.mono[700]}
                >
                  {get(record, 'type')}
                </Typography>
              </Block>
              <Flex.Column
                flexGrow
                paddingVertical="6px"
                paddingHorizontal="12px"
                gridGap="6px"
              >
                <Flex.Row
                  fullWidth
                  justify="space-between"
                  align="center"
                  gridGap="4px"
                >
                  <Typography
                    as="span"
                    fontSize="14px"
                    fontStyle="medium"
                    fg={(colors) => colors.mono[900]}
                  >
                    {get(record, 'name')}
                  </Typography>
                  <ClickToCopy text={get(record, 'name')}>
                    {(copyButtonProps) => (
                      <Tooltip copy="Copy DNS Name" point={Tooltip.UP_RIGHT_ALIGNED}>
                        <Buttons.IconButton
                          IconComponent={Icons.Copy}
                          color={(colors) => colors.mono[700]}
                          hoverColor={(colors) => colors.mono[900]}
                          aria-label="Copy DNS Name"
                          {...copyButtonProps}
                        />
                      </Tooltip>
                    )}
                  </ClickToCopy>
                </Flex.Row>
                <Flex.Row
                  fullWidth
                  justify="space-between"
                  align="center"
                  gridGap="4px"
                >
                  <Typography
                    as="span"
                    fontSize="14px"
                    fontStyle="medium"
                    fg={(colors) => colors.mono[900]}
                  >
                    {get(record, 'ip')}
                  </Typography>
                  <ClickToCopy text={get(record, 'ip')}>
                    {(copyButtonProps) => (
                      <Tooltip copy="Copy IP" point={Tooltip.UP_RIGHT_ALIGNED}>
                        <Buttons.IconButton
                          IconComponent={Icons.Copy}
                          color={(colors) => colors.mono[700]}
                          hoverColor={(colors) => colors.mono[900]}
                          aria-label="Copy IP"
                          {...copyButtonProps}
                        />
                      </Tooltip>
                    )}
                  </ClickToCopy>
                </Flex.Row>
              </Flex.Column>
            </Flex.Row>
          ))}
        </Flex.Column>
        <Typography fontSize="16px" fg={(colors) => colors.mono[700]}>
          Afterwards, verify the DNS change you made. If it doesn't show up immediately, don't panic! It can take a few minutes for DNS updates to take effect.
        </Typography>
        <Flex.Column gridGap="6px">
          {!!failedValidation && (
            <Typography fontSize="16px" fg={(colors) => colors.red[500]}>
              Failed to verify DNS record, try again in a few seconds
            </Typography>
          )}
          <Buttons.Filled
            fullWidth
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => colors.blue[500]}
            hoverButtonBg={(colors) => colors.blue[700]}
            paddingVertical="4px"
            paddingHorizontal="8px"
            isLoading={isLoading}
            onClick={verifyDns}
          >
            <Typography fontStyle="medium" fontSize="14px">
              Verify DNS
            </Typography>
          </Buttons.Filled>
        </Flex.Column>
      </Flex.Column>
    </ModalDefaultLayout>
  );
}
