import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import WorkspaceInstanceCard from '@editor/components/Workspace/InstanceCard';
import { COMPONENT_TYPE, COMPONENT_INSTANCE } from '@editor/constants/DragTypes';
import { selectComponentSlotMapped } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function SlotInstanceList(props) {
  const { slotId } = props;

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const slotComponents = useSelector(selectComponentSlotMapped(activePageId, activeComponentId, slotId));
  const totalComponentsInSlot = slotComponents.length;

  return (
    <Container gridGap="12px">
      {slotComponents.map((component) => (
        <WorkspaceInstanceCard
          key={component.id}
          componentId={component.id}
          slotId={slotId}
        />
      ))}
    </Container>
  );
}

const Container = styled(Flex.Column)`
  ${(props) => props.isOver && css`
    background-color: ${(props) => props.theme.colors.purple[100]};
  `}
`;
