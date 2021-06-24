import React from 'react';
import styled, { keyframes } from 'styled-components';
import { get } from 'lodash';
import { ComponentMeta } from 'pkg.campaign-components';
import { Flex, Grid } from 'pkg.admin-components';
import { useSelector } from 'react-redux';
import LibraryCard from '@editor/components/Workspace/LibraryCard';
import { SLOTS_TAB, selectTab } from '@editor/features/workspace';

export default function WorkspaceComponentLibrary() {
  const tab = useSelector(selectTab);
  const isSlotsTab = tab === SLOTS_TAB;

  const availableComponents = Object.values(ComponentMeta)
    .filter((meta) => !get(meta, 'devOnly', false));

  return (
    <Container isSlotsTab={isSlotsTab}>
      <ComponentList flexGrow padding="12px" gap="12px" columns="1fr 1fr">
        {availableComponents.map(({ tag }) => (
          <LibraryCard key={tag} tag={tag} />
        ))}
      </ComponentList>
    </Container>
  );
}

const height = '33.33%';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, ${height}, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, ${height}, 0);
  }
`;

const Container = styled(Flex.Column)`
  height: ${height};
  animation: ${(props) => props.isSlotsTab ? slideUp : slideDown} 0.4s forwards ${(props) => props.isSlotsTab ? 'ease-in' : 'ease-out'};
`;

const ComponentList = styled(Grid)`
  background-color: ${({ theme }) => theme.colors.mono[200]};
`;
