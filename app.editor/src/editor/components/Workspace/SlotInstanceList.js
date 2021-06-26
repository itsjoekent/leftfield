import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { Flex } from 'pkg.admin-components';
import WorkspaceInstanceCard from '@editor/components/Workspace/InstanceCard';
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
    <Droppable droppableId={slotId}>
      {(provided, snapshot) => (
        <Container
          paddingVertical="12px"
          paddingHorizontal="12px"
          gridGap="12px"
          ref={provided.innerRef}
          isOver={snapshot.isDraggingOver}
          {...provided.droppableProps}
        >
          {slotComponents.map((component, index) => (
            <WorkspaceInstanceCard
              key={component.id}
              componentId={component.id}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
}

const Container = styled(Flex.Column)`
  min-height: 12px;
  border-top-left-radius: ${(props) => props.theme.rounded.default};
  border-top-right-radius: ${(props) => props.theme.rounded.default};

  ${(props) => props.isOver && css`
    background-color: ${(props) => props.theme.colors.purple[100]};
  `}
`;
