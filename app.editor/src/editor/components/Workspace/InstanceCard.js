import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Flex, Icons } from 'pkg.admin-components';
import { selectComponent } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function InstanceCard(props) {
  const { componentId, index } = props;

  const { activeComponentId, activePageId } = useActiveWorkspaceComponent();
  const component = useSelector(selectComponent(activePageId, componentId));

  return (
    <Draggable draggableId={componentId} index={index}>
      {(provided, snapshot) => (
        <Container
          paddingVertical="6px"
          paddingHorizontal="12px"
          gridGap="4px"
          align="center"
          justify="space-between"
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Flex.Row flexGrow overflowX="hidden">
            <Label>{get(component, 'name')}</Label>
          </Flex.Row>
        </Container>
      )}
    </Draggable>
  );
}

const Container = styled(Flex.Row)`
  height: fit-content;
  background-color: ${(props) => props.theme.colors.mono[100]};
  border-radius: ${(props) => props.theme.rounded.default};
  cursor: grab;
  ${(props) => props.theme.shadow.light}

  ${(props) => props.isDragging && css`
    box-shadow: none;
  `}

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[200]};
  }
`;

const Label = styled.p`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 16px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.mono[700]};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
