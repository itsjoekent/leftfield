import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Buttons, Flex, Icons } from 'pkg.admin-components';
import { selectComponent } from '@editor/features/assembly';
import { setActiveComponentId } from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function InstanceCard(props) {
  const { componentId, index } = props;

  const { activeComponentId, activePageId } = useActiveWorkspaceComponent();
  const component = useSelector(selectComponent(activePageId, componentId));

  const dispatch = useDispatch();

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
          <IconRow align="center" gridGap="6px">
            <Buttons.IconButton
              IconComponent={Icons.SettingAltLine}
              color={(theme) => theme.colors.mono[500]}
              hoverColor={(theme) => theme.colors.purple[600]}
              onClick={() => dispatch(setActiveComponentId(componentId))}
              aria-label="Edit component"
            />
            <Buttons.IconButton
              IconComponent={Icons.Copy}
              color={(theme) => theme.colors.mono[500]}
              hoverColor={(theme) => theme.colors.mono[900]}
              aria-label="Copy component"
            />
            <Buttons.IconButton
              IconComponent={Icons.DeskAlt}
              color={(theme) => theme.colors.mono[500]}
              hoverColor={(theme) => theme.colors.mono[900]}
              aria-label="Paste component"
            />
            <Buttons.IconButton
              IconComponent={Icons.CopyAlt}
              color={(theme) => theme.colors.mono[500]}
              hoverColor={(theme) => theme.colors.mono[900]}
              aria-label="Duplicate component"
            />
            <Buttons.IconButton
              IconComponent={Icons.Trash}
              color={(theme) => theme.colors.mono[500]}
              hoverColor={(theme) => theme.colors.red[600]}
              aria-label="Remove component"
            />
          </IconRow>
        </Container>
      )}
    </Draggable>
  );
}

const IconRow = styled(Flex.Row)`
  opacity: 0;
  transition: opacity ${(props) => props.theme.animation.defaultTransition};
`;

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

    ${IconRow} {
      opacity: 1;
    }
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
