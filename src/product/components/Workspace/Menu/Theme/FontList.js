import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import WorkspaceMenuThemeFont from '@product/components/Workspace/Menu/Theme/Font';
import {
  setCampaignThemeKeyValue,
  setMetaValue,
  selectCampaignThemeFontsAsSortedArray,
} from '@product/features/assembly';
import { setModal, FONTS_MODAL } from '@product/features/modal';

export default function FontList() {
  const dispatch = useDispatch();

  const campaignFonts = useSelector(selectCampaignThemeFontsAsSortedArray);

  function addFont() {
    dispatch(setModal({
      type: FONTS_MODAL,
    }));
  }

  function onDragEnd(result) {
    const { destination, source } = result;
    if (!destination) return;

    dispatch(setMetaValue({
      fromIndex: source.index,
      op: '$REORDER',
      path: 'fontSortOrder',
      toIndex: destination.index,
    }));
  }

  return (
    <Flex.Column gridGap="16px">
      <Flex.Row align="center" justify="space-between">
        <Typography
          as="h3"
          fontStyle="bold"
          fontSize="16px"
          fg={(colors) => colors.mono[700]}
        >
          Fonts
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
          onClick={addFont}
        >
          <Typography fontStyle="medium" fontSize="14px">
            Add Font
          </Typography>
        </Buttons.Filled>
      </Flex.Row>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="theme-fonts">
          {(provided, snapshot) => (
            <Flex.Column
              ref={provided.innerRef}
              {...provided.droppableProps}
              gridGap="6px"
              bg={(colors) => snapshot.isDraggingOver ? colors.purple[100] : colors.mono[200]}
              padding="6px"
              rounded={(radius) => radius.default}
            >
              {campaignFonts.map((font, index) => (
                <WorkspaceMenuThemeFont
                  key={font.id}
                  font={font}
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
