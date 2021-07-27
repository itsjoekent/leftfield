import React from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import WorkspaceMenuThemeColor from '@product/components/Workspace/Menu/Theme/Color';
import {
  setCampaignThemeKeyValue,
  setMetaValue,
  selectCampaignThemeColorsAsSortedArray,
  selectMetaColorSortOrder,
} from '@product/features/assembly';

export default function ColorList() {
  const dispatch = useDispatch();

  const campaignThemeColors = useSelector(selectCampaignThemeColorsAsSortedArray);
  const colorSortOrder = useSelector(selectMetaColorSortOrder);

  function addColor() {
    const id = uuid();
    dispatch(setCampaignThemeKeyValue({
      path: `colors.${id}`,
      value: {
        label: '',
        type: 'solid',
        value: '#FFF',
      },
    }));

    dispatch(setMetaValue({
      path: 'colorSortOrder',
      value: [id, ...colorSortOrder],
    }));
  }

  function onDragEnd(result) {
    const { destination, source } = result;
    if (!destination) return;

    dispatch(setMetaValue({
      fromIndex: source.index,
      op: '$REORDER',
      path: 'colorSortOrder',
      toIndex: destination.index,
    }));
  }

  return (
    <Flex.Column gridGap="16px">
      <Flex.Row align="center" justify="space-between">
        <Typography
          fontStyle="bold"
          fontSize="16px"
          fg={(colors) => colors.mono[700]}
        >
          Colors
        </Typography>
        <Buttons.Filled
          IconComponent={Icons.AddRound}
          iconSize="18px"
          buttonFg={(colors) => colors.mono[100]}
          buttonBg={(colors) => colors.blue[500]}
          hoverButtonBg={(colors) => colors.blue[700]}
          gridGap="2px"
          paddingVertical="2px"
          paddingHorizontal="4px"
          onClick={addColor}
        >
          <Typography fontStyle="medium" fontSize="14px">
            Add Color
          </Typography>
        </Buttons.Filled>
      </Flex.Row>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="theme-colors">
          {(provided, snapshot) => (
            <Flex.Column
              ref={provided.innerRef}
              {...provided.droppableProps}
              gridGap="6px"
              bg={(colors) => snapshot.isDraggingOver ? colors.purple[100] : colors.mono[200]}
              padding="6px"
              rounded={(radius) => radius.default}
            >
              {campaignThemeColors.map((color, index) => (
                <WorkspaceMenuThemeColor
                  key={color.id}
                  color={color}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Flex.Column>
          )}
        </Droppable>
      </DragDropContext>
    </Flex.Column>
  );
}
