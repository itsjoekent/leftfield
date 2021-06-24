import React from 'react';
import styled from 'styled-components';
import { Flex } from 'pkg.admin-components';

export default function WorkspaceSection(props) {
  const { children, name } = props;

  return (
    <Flex.Column>
      <Header>
        {name}
      </Header>
      {children}
    </Flex.Column>
  );
}

const Header = styled.h2`
  ${(props) => props.theme.fonts.main.extraBold};
  font-size: 22px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.mono[700]};
  margin-bottom: 16px;
`;
