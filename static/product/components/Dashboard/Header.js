import React from 'react';
import { Block, Flex, Typography } from 'pkg.admin-components';
import AccountButton from '@product/components/Dashboard/AccountButton';
import HomeButton from '@product/components/HomeButton';

export default function DashboardHeader() {
  return (
    <Flex.Column fullWidth gridGap="6px">
      <Flex.Row
        justify="space-between"
        align="center"
        paddingVertical="16px"
      >
        <HomeButton />
        <Flex.Row align="center" gridGap="12px">
          <AccountButton />
        </Flex.Row>
      </Flex.Row>
      <Block
        fullWidth
        specificHeight="2px"
        bg={(colors) => colors.blue[100]}
      />
    </Flex.Column>
  );
}
