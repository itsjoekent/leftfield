import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { Flex, Icons, useAdminTheme } from 'pkg.admin-components';
import { COMPONENT_INSTANCE } from '@editor/constants/DragTypes';
import {
  selectComponent,
  selectComponentSlot,
  reorderChildComponentInstance,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function InstanceCard(props) {
  const { componentId, slotId } = props;

  const { activeComponentId, activePageId } = useActiveWorkspaceComponent();
  const component = useSelector(selectComponent(activePageId, componentId));

  const slotComponents = useSelector(selectComponentSlot(activePageId, activeComponentId, slotId));
  const instanceIndex = slotComponents.findIndex((compare) => compare === componentId);

  const theme = useAdminTheme();
  const dispatch = useDispatch();

  const cardRef = React.useRef(null);

  // Maybe move the drop to the instance list
  // Figure out order within that using some janky math?
  // Bonus: Can add ghost slots where you're trying to drag?
  const [{}, dropRef] = useDrop(() => ({
    accept: COMPONENT_INSTANCE,
    hover: (item, monitor) => {
      if (!cardRef.current) {
        return;
      }

      const { instanceIndex: draggedFromIndex } = item;

      if (instanceIndex === draggedFromIndex) {
        return;
      }

      const hoverBoundingRect = cardRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (draggedFromIndex < instanceIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (draggedFromIndex > instanceIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dispatch(reorderChildComponentInstance({
        pageId: activePageId,
        componentId: activeComponentId,
        slotId,
        fromIndex: draggedFromIndex,
        toIndex: instanceIndex,
      }));
    },
  }), [
    activePageId,
    activeComponentId,
    slotId,
  ]);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: COMPONENT_INSTANCE,
    item: { componentId, instanceIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [
    componentId,
    instanceIndex,
  ]);

  dragRef(dropRef(cardRef));

  return (
    <Container
      paddingVertical="6px"
      paddingHorizontal="12px"
      gridGap="4px"
      align="center"
      justify="space-between"
      isDragging={isDragging}
      ref={cardRef}
    >
      <Flex.Row flexGrow overflowX="hidden">
        <Label>{get(component, 'name')}</Label>
      </Flex.Row>
    </Container>
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
    opacity: 0;
    cursor: grabbing;

    ${Label}, ${Flex.Row} {
      cursor: grabbing;
    }
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
