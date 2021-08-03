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
} from 'pkg.admin-components';
import {
  deleteComponentAndDescendants,
  duplicateComponent,
  selectComponent,
} from '@product/features/assembly';
import { setModal, CONFIRM_MODAL } from '@product/features/modal';
import { setActiveComponentId } from '@product/features/workspace';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

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
            <Tooltip copy="Edit component" point={Tooltip.UP_RIGHT_ALIGNED}>
              <Buttons.IconButton
                IconComponent={Icons.EditFill}
                color={(colors) => colors.mono[500]}
                hoverColor={(colors) => colors.purple[500]}
                aria-label="Edit component"
                onClick={() => dispatch(setActiveComponentId({ componentId }))}
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
                onClick={() => dispatch(setModal({
                  type: CONFIRM_MODAL,
                  props: {
                    title: 'Confirm deletion',
                    header: 'Are you sure you want to delete this component?',
                    confirmButtonLabel: 'Delete component',
                    confirmButtonIconName: 'Trash',
                    isDangerous: true,
                    onConfirm: () => dispatch(deleteComponentAndDescendants({
                      pageId: activePageId,
                      componentId,
                    })),
                  },
                }))}
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
