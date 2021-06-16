import React from 'react';
import styled from 'styled-components';
import { Typography } from 'pkg.admin-components';

export default function Workspace() {
  return (
    <Container>
      <DropdownPlaceholder>
        <Typography.LargeMenuTitle>Edit your splash page</Typography.LargeMenuTitle>
      </DropdownPlaceholder>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DropdownPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 6px 12px;
  background-color: ${(props) => props.theme.colors.blue[100]};

  ${Typography.LargeMenuTitle} {
    color: ${(props) => props.theme.colors.blue[500]};
  }
`;
