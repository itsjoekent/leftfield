import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useDragLayer } from 'react-dnd';
import { find, get } from 'lodash';
import { Flex } from 'pkg.admin-components';
import WorkspaceSlotDropper from '@editor/components/Workspace/SlotDropper';
import { COMPONENT_TYPE } from '@editor/constants/DragTypes';
import { selectComponentSlotMapped } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

// drop area
// red bg if doesn't have min

export default function SlotList(props) {
  const { slotId } = props;

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const { isOver } = useDragLayer(() => ({
    accept: COMPONENT_TYPE,
    drop: () => ({
      pageId: activePageId,
      componentId: activeComponentId,
      slotId,
      slotPlacementOrder: totalComponentsInSlot,
    }),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const slotMeta = find(get(activeComponentMeta, 'slots', []), { id: slotId });
  const isList = get(slotMeta, 'isList', false);
  const minListSize = get(slotMeta, 'min', 0);
  const maxListSize = get(slotMeta, 'max', 0);

  const slotComponents = useSelector(selectComponentSlotMapped(activePageId, activeComponentId, slotId));

  const totalComponentsInSlot = slotComponents.length;
  const plural = totalComponentsInSlot !== 1 ? 's' : '';

  const counterCopy = get(slotMeta, 'isList', false) ? (
    maxListSize ? `${totalComponentsInSlot}/${maxListSize} component${plural} used` : `${totalComponentsInSlot} component${plural}`
  ) : `${totalComponentsInSlot}/1 components used`;

  const hasEmptyChannel = isList ? (
    maxListSize ? totalComponentsInSlot < maxListSize : true
  ) : totalComponentsInSlot < 1;

  return (
    <Container padding="12px" gridGap="12px">
      <Counter>{counterCopy}</Counter>
      {hasEmptyChannel && isOver && (
        <WorkspaceSlotDropper slotId={slotId} />
      )}
    </Container>
  );
}

const Container = styled(Flex.Column)`
  background-color: ${(props) => props.theme.colors.mono[300]};
  border-radius: ${(props) => props.theme.rounded.default};
`;

const Counter = styled.p`
  ${(props) => props.theme.fonts.main.thin};
  font-size: 10px;
  color: ${(props) => props.theme.colors.mono[600]};
`;
