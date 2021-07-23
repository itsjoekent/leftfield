import React from 'react';
import { useSelector } from 'react-redux';
import { Flex, Typography } from 'pkg.admin-components';
import useAuthGate from '@product/hooks/useAuthGate';

export const DASHBOARD_ROUTE = '/dashboard';

export default function Dashboard() {
  useAuthGate();

  return (
    <Flex.Column
      align="center"
      gridGap="32px"
      bg={(colors) => colors.mono[200]}
      minHeight="100vh"
    >
      <Flex.Row
        fullWidth
        justify="space-between"
        align="center"
        bg={(colors) => colors.mono[100]}
        shadow={(shadows) => shadows.light}
        padding="12px"
      >
        {/*  */}
      </Flex.Row>
      <Flex.Column fullWidth maxWidth="800px" gridGap="48px">
        <Flex.Column fullWidth gridGap="12px">
          <Typography
            as="h2"
            fontStyle="bold"
            fontSize="26px"
            fg={(colors) => colors.mono[700]}
          >
            Websites
          </Typography>
        </Flex.Column>
        <Flex.Column fullWidth gridGap="12px">
          <Typography
            as="h2"
            fontStyle="bold"
            fontSize="26px"
            fg={(colors) => colors.mono[700]}
          >
            Team
          </Typography>
        </Flex.Column>
        <Flex.Column fullWidth gridGap="12px">
          <Typography
            as="h2"
            fontStyle="bold"
            fontSize="26px"
            fg={(colors) => colors.mono[700]}
          >
            Billing
          </Typography>
        </Flex.Column>
      </Flex.Column>
    </Flex.Column>
  );
}
