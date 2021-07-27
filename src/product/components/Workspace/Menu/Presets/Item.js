import React from 'react';
import { withTheme } from 'styled-components';
import { get } from 'lodash';
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
import {
  archivePreset,
  setPresetName,
  setMetaValue,
} from '@product/features/assembly';
import { setModal, CONFIRM_MODAL } from '@product/features/modal';

function Item(props) {
  const { index, preset, theme } = props;

  const presetId = get(preset, 'id');

  const dispatch = useDispatch();

  function onNameChange(event) {
    const { target: { value } } = event;

    dispatch(setPresetName({
      presetId,
      name: value,
    }));
  }

  function onArchive() {
    dispatch(archivePreset({ presetId }));

    dispatch(setMetaValue({
      index,
      op: '$PULL',
      path: `presetSortOrder.${preset.type}`,
    }));
  }

  return (
    <Draggable draggableId={presetId} index={index}>
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
                value={preset.name}
              />
              <Buttons.Text
                buttonFg={(colors) => colors.mono[500]}
                hoverButtonFg={(colors) => colors.red[500]}
                onClick={() => dispatch(setModal({
                  type: CONFIRM_MODAL,
                  props: {
                    header: 'Are you sure you want to archive this preset?',
                    confirmButtonLabel: 'Archive preset',
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

export default withTheme(Item);
