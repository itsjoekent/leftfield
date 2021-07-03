import React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { Flex } from 'pkg.admin-components';
import WorkspaceFieldLabel from '@editor/components/Workspace/FieldLabel';
import WorkspaceSlotList from '@editor/components/Workspace/SlotList';
import {
  addChildComponentInstance,
  reorderChildComponentInstance,
  removeChildComponentInstance,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useDynamicEvaluation from '@editor/hooks/useDynamicEvaluation';

export default function WorkspaceSlotsSection() {
  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const { evaluateDynamicSlot } = useDynamicEvaluation(activePageId, activeComponentId);

  const slots = get(activeComponentMeta, 'slots', []);
  const visibleSlots = slots.filter((slot) => {
    const conditional = get(slot, 'conditional', null);
    if (!conditional) {
      return true;
    }

    return evaluateDynamicSlot(slot, 'conditional');
  });

  function onDragEnd(result) {
    const {
      draggableId,
      source,
      destination,
    } = result;

    if (!destination) {
      return;
    }

    if (
      (destination.droppableId === source.droppableId)
      && (destination.index === source.index)
    ) {
      return;
    }

    if (destination.droppableId !== source.droppableId) {
      dispatch(removeChildComponentInstance({
        pageId: activePageId,
        componentId: activeComponentId,
        slotId: source.droppableId,
        targetIndex: source.index,
      }));

      dispatch(addChildComponentInstance({
        pageId: activePageId,
        componentId: draggableId,
        parentComponentId: activeComponentId,
        slotId: destination.droppableId,
        slotPlacementOrder: destination.index,
      }));
    } else {
      dispatch(reorderChildComponentInstance({
        pageId: activePageId,
        componentId: activeComponentId,
        slotId: source.droppableId,
        fromIndex: source.index,
        toIndex: destination.index,
      }));
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex.Column gridGap="16px">
        {visibleSlots.map((slot) => (
          <Flex.Column gridGap="6px" key={slot.id}>
            <WorkspaceFieldLabel
              labelProps={{
                children: slot.label,
              }}
              isRequired={false}
              help={slot.help}
            />
            <WorkspaceSlotList slotId={slot.id} />
          </Flex.Column>
        ))}
      </Flex.Column>
    </DragDropContext>
  );
}
