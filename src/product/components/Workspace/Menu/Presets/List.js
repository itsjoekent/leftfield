import React from 'react';
import get from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Styles as CampaignComponentStyles } from 'pkg.campaign-components';
import { Flex, Typography } from 'pkg.admin-components';
import {
  selectPresetsOfTypeSortedAsArray,
  setMetaValue,
} from '@product/features/assembly';
import WorkspaceMenuPresetItem from '@product/components/Workspace/Menu/Presets/Item';

export default function List(props) {
  const { styleKey } = props;
  const { humanName } = CampaignComponentStyles[styleKey];

  const presets = useSelector(selectPresetsOfTypeSortedAsArray(styleKey));

  const dispatch = useDispatch();

  function onDragEnd(result) {
    const { destination, source } = result;
    if (!destination) return;

    dispatch(setMetaValue({
      fromIndex: source.index,
      op: '$REORDER',
      path: `presetSortOrder.${styleKey}`,
      toIndex: destination.index,
    }));
  }

  return (
    <Flex.Column gridGap="6px">
      <Typography
        as="h3"
        fontStyle="bold"
        fontSize="16px"
        fg={(colors) => colors.mono[700]}
      >{humanName}</Typography>
      {!presets.length && (
        <Typography
          fontStyle="light"
          fontSize="14px"
          fg={(colors) => colors.mono[600]}
        >
          No presets defined
        </Typography>
      )}
      {!!presets.length && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="theme-presets">
            {(provided, snapshot) => (
              <Flex.Column
                ref={provided.innerRef}
                {...provided.droppableProps}
                gridGap="6px"
                bg={(colors) => snapshot.isDraggingOver ? colors.purple[100] : colors.mono[200]}
                padding="6px"
                rounded={(radius) => radius.default}
              >
                {presets.map((preset, index) => (
                  <WorkspaceMenuPresetItem key={preset.id} preset={preset} index={index} />
                ))}
                {provided.placeholder}
              </Flex.Column>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Flex.Column>
  );
}
