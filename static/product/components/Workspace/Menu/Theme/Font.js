import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import {
  Block,
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { setCampaignThemeKeyValue, setMetaValue } from '@product/features/assembly';
import { setModal, CONFIRM_MODAL, FONTS_MODAL } from '@product/features/modal';

function Font(props) {
  const { index, font, theme } = props;

  const dispatch = useDispatch();

  function onNameChange(event) {
    const { target: { value } } = event;

    dispatch(setCampaignThemeKeyValue({
      path: `fonts.${font.id}.label`,
      value,
    }));
  }

  function onArchive() {
    dispatch(setCampaignThemeKeyValue({
      path: `fonts.${font.id}.isArchived`,
      value: true,
    }));

    dispatch(setMetaValue({
      index,
      op: '$PULL',
      path: 'fontSortOrder',
    }));
  }

  return (
    <Draggable draggableId={font.id} index={index}>
      {(provided, snapshot) => {
        // Fix weird issue with using `transform` in a parent element.
        if (snapshot.isDragging) {
          provided.draggableProps.style.top = provided.draggableProps.style.top - theme.navHeight;
        }

        return (
          <Flex.Row
            ref={provided.innerRef}
            {...provided.draggableProps}
            align="center"
            gridGap="12px"
            padding="6px"
            bg={(colors) => colors.mono[100]}
            rounded={(radius) => radius.default}
            shadow={(shadows) => shadows.light}
          >
            <Block specificHeight="24px" {...provided.dragHandleProps}>
              <Icons.Menu color={theme.colors.mono[snapshot.isDragging ? 700 : 500]} />
            </Block>
            <Flex.Row flexGrow align="center" gridGap="6px">
              <Inputs.DefaultText
                onChange={onNameChange}
                value={font.label}
              />
              <Buttons.Text
                buttonFg={(colors) => colors.mono[500]}
                hoverButtonFg={(colors) => colors.mono[700]}
                onClick={() => dispatch(setModal({
                  type: FONTS_MODAL,
                  props: { font },
                }))}
              >
                <Typography fontStyle="medium" fontSize="14px">
                  Edit
                </Typography>
              </Buttons.Text>
              <Buttons.Text
                buttonFg={(colors) => colors.mono[500]}
                hoverButtonFg={(colors) => colors.red[500]}
                onClick={() => dispatch(setModal({
                  type: CONFIRM_MODAL,
                  props: {
                    header: 'Are you sure you want to archive this font?',
                    confirmButtonLabel: 'Archive font',
                    confirmButtonIconName: 'ArchiveFill',
                    isDangerous: true,
                    onConfirm: onArchive,
                  },
                }))}
              >
                <Typography fontStyle="medium" fontSize="14px">
                  Archive
                </Typography>
              </Buttons.Text>
            </Flex.Row>
          </Flex.Row>
        );
      }}
    </Draggable>
  );
}

export default withTheme(Font);
