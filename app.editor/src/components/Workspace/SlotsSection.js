import React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import WorkspaceFieldLabel from '@editor/components/Workspace/FieldLabel';
import WorkspaceFieldList from '@editor/components/Workspace/FieldList';
import WorkspaceFieldGroup from '@editor/components/Workspace/FieldGroup';
import WorkspaceSlotList from '@editor/components/Workspace/SlotList';
import {
  addChildComponentInstance,
  reorderChildComponentInstance,
  removeChildComponentInstance,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function WorkspaceSlotsSection() {
  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const slots = get(activeComponentMeta, 'slots', []);

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
      <WorkspaceFieldList>
        {slots.map((slot) => (
          <WorkspaceFieldGroup key={slot.id}>
            <WorkspaceFieldLabel
              labelCopy={slot.label}
              labelFor={false}
              isRequired={false}
              help={slot.help}
            />
            <WorkspaceSlotList slotId={slot.id} />
          </WorkspaceFieldGroup>
        ))}
      </WorkspaceFieldList>
    </DragDropContext>
  );
}
