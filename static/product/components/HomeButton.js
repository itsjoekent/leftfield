import React from 'react';
import styled from 'styled-components';
import { Link } from 'wouter';
import BlueLogo from '@assets/logo-wide-blue.svg';
import WhiteLogo from '@assets/logo-wide-white.svg';
import { DASHBOARD_ROUTE } from '@product/routes/Dashboard';

export default function HomeButton(props) {
  const {
    color = 'blue',
    height = '28px',
  } = props;

  const Logo = color === 'blue' ? BlueLogo : WhiteLogo;

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
