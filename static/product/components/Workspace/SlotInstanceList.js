import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { Flex } from 'pkg.admin-components';
import WorkspaceInstanceCard from '@product/components/Workspace/InstanceCard';
import { selectComponentSlotMapped } from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function SlotInstanceList(props) {
  const { slotId } = props;

  const {
    activePageRoute,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const slotComponents = useSelector(selectComponentSlotMapped(activePageRoute, activeComponentId, slotId));

  return (
    <Droppable droppableId={slotId}>
      {(provided, snapshot) => (
        <Container
          paddingVertical="12px"
          paddingHorizontal="12px"
          gridGap="12px"
          minHeight="12px"
          ref={provided.innerRef}
          bg={(colors) => snapshot.isDraggingOver ? colors.purple[100] : colors.mono[300]}
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
  border-top-left-radius: ${(props) => props.theme.rounded.default};
  border-top-right-radius: ${(props) => props.theme.rounded.default};
`;
