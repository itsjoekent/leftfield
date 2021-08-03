import React from 'react';
import styled, { withTheme } from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { ChromePicker } from 'react-color';
import {
  Buttons,
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { setCampaignThemeKeyValue, setMetaValue } from '@product/features/assembly';
import { setModal, CONFIRM_MODAL } from '@product/features/modal';
import useClickOutside from '@product/hooks/useClickOutside';
import parseColorPicker from '@product/utils/parseColorPicker';

function Color(props) {
  const { index, color, theme } = props;

  const dispatch = useDispatch();

  const [localColor, setLocalColor] = React.useState(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);

  const colorPickerRef = useClickOutside(() => {
    if (isColorPickerOpen) {
      setIsColorPickerOpen(false);
    }
  }, [isColorPickerOpen]);

  function onNameChange(event) {
    const { target: { value } } = event;

    dispatch(setCampaignThemeKeyValue({
      path: `colors.${color.id}.label`,
      value,
    }));
  }

  function onColorChange(value) {
    setLocalColor(null);
    dispatch(setCampaignThemeKeyValue({
      path: `colors.${color.id}.value`,
      value,
    }));
  }

  function onArchive() {
    dispatch(setCampaignThemeKeyValue({
      path: `colors.${color.id}.isArchived`,
      value: true,
    }));

    dispatch(setMetaValue({
      index,
      op: '$PULL',
      path: 'colorSortOrder',
    }));
  }

  const swatchColor = localColor || color.value || '#FFF';

  return (
    <Draggable draggableId={color.id} index={index}>
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
            <Swatch
              {...provided.dragHandleProps}
              colorValue={swatchColor}
            />
            <Flex.Row
              ref={colorPickerRef}
              flexGrow
              align="center"
              gridGap="6px"
              position="relative"
            >
              <Inputs.DefaultText
                onChange={onNameChange}
                value={color.label}
              />
              <Buttons.Text
                buttonFg={(colors) => colors.mono[500]}
                hoverButtonFg={(colors) => colors.mono[700]}
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
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
                    header: 'Are you sure you want to archive this color?',
                    confirmButtonLabel: 'Archive color',
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
              {isColorPickerOpen && (
                <ColorPickerWrapper>
                  <ChromePicker
                    color={swatchColor}
                    onChange={(output) => setLocalColor(parseColorPicker(output))}
                    onChangeComplete={(output) => onColorChange(parseColorPicker(output))}
                  />
                </ColorPickerWrapper>
              )}
            </Flex.Row>
          </Flex.Row>
        );
      }}
    </Draggable>
  );
}

export default withTheme(Color);

const Swatch = styled.span`
  display: block;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 24px;
  border: 2px solid ${(props) => props.theme.colors.mono[700]};
  background-color: ${(props) => props.colorValue};
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
`;
