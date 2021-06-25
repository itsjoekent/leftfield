import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { find, get } from 'lodash';
import { Flex } from 'pkg.admin-components';
import WorkspaceSlotDropper from '@editor/components/Workspace/SlotDropper';
import WorkspaceSlotInstanceList from '@editor/components/Workspace/SlotInstanceList';
import { COMPONENT_TYPE } from '@editor/constants/DragTypes';
import { selectComponentSlot } from '@editor/features/assembly';
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

  const slotMeta = find(get(activeComponentMeta, 'slots', []), { id: slotId });
  const isList = get(slotMeta, 'isList', false);
  const minListSize = get(slotMeta, 'min', 0);
  const maxListSize = get(slotMeta, 'max', 0);

  const slotComponents = useSelector(selectComponentSlot(activePageId, activeComponentId, slotId));

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
      {!!totalComponentsInSlot && (
        <WorkspaceSlotInstanceList slotId={slotId} />
      )}
      {hasEmptyChannel && (
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
  ${(props) => props.theme.fonts.main.light};
  font-size: 11px;
  color: ${(props) => props.theme.colors.mono[900]};
`;
