import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  Typography,
} from 'pkg.admin-components';
import {
  duplicateComponent,
  selectComponent,
} from '@editor/features/assembly';
import { setActiveComponentId } from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function InstanceCard(props) {
  const { componentId, index } = props;

  const { activePageId } = useActiveWorkspaceComponent();
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
            <Buttons.Outline
              paddingVertical="2px"
              paddingHorizontal="4px"
              bg={(colors) => colors.mono[100]}
              borderWidth="1px"
              borderColor={(colors) => colors.mono[500]}
              hoverBorderColor={(colors) => colors.purple[500]}
              gridGap="4px"
              IconComponent={Icons.EditFill}
              iconSize={16}
              onClick={() => dispatch(setActiveComponentId(componentId))}
            >
              <Typography
                fontStyle="medium"
                fontSize="16px"
              >
                Edit
              </Typography>
            </Buttons.Outline>
            <Tooltip copy="Copy component" point={Tooltip.UP}>
              <Buttons.IconButton
                IconComponent={Icons.Copy}
                color={(colors) => colors.mono[500]}
                hoverColor={(colors) => colors.mono[900]}
                aria-label="Copy component"
              />
            </Tooltip>
            <Tooltip copy="Paste component" point={Tooltip.UP}>
              <Buttons.IconButton
                IconComponent={Icons.DeskAlt}
                color={(colors) => colors.mono[500]}
                hoverColor={(colors) => colors.mono[900]}
                aria-label="Paste component"
              />
            </Tooltip>
            <Tooltip copy="Duplicate component" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.CopyAlt}
                color={(colors) => colors.mono[500]}
                hoverColor={(colors) => colors.mono[900]}
                aria-label="Duplicate component"
                onClick={() => dispatch(duplicateComponent({
                  pageId: activePageId,
                  componentId,
                }))}
              />
            </Tooltip>
            <Tooltip copy="Remove component" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.Trash}
                color={(colors) => colors.mono[500]}
                hoverColor={(colors) => colors.red[600]}
                aria-label="Remove component"
              />
            </Tooltip>
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
