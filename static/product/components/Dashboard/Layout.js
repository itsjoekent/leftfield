import React from 'react';
import { Flex } from 'pkg.admin-components';
import DashboardHeader from '@product/components/Dashboard/Header';
import useAuthGate from '@product/hooks/useAuthGate';

export default function DashboardLayout(props) {
  const { children } = props;

  useAuthGate();

  return (
    <Flex.Column fullWidth align="center">
      <Flex.Column fullWidth maxWidth="960px">
        <DashboardHeader />
        {children}
      </Flex.Column>
    </Flex.Column>
  );
}
