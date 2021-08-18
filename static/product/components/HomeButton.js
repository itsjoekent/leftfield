import React from 'react';
import styled from 'styled-components';
import { Link } from 'wouter';
import Logo from '@assets/logo-wide-blue.svg';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';

export default function HomeButton(props) {
  const {
    height = '28px',
  } = props;

  return (
    <Link href={DASHBOARD_ROUTE}>
      <Anchor>
        <Logo width="100%" height={height} />
      </Anchor>
    </Link>
  );
}

const Anchor = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
