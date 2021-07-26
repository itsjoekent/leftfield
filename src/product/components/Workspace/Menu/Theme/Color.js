import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { ChromePicker } from 'react-color';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Tooltip,
} from 'pkg.admin-components';
import { setCampaignThemeKeyValue } from '@product/features/assembly';
import { setModal, CONFIRM_MODAL } from '@product/features/modal';
import useClickOutside from '@product/hooks/useClickOutside';
import parseColorPicker from '@product/utils/parseColorPicker';

export default function Color(props) {
  const { color } = props;

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

  function onDelete() {
    dispatch(setCampaignThemeKeyValue({
      path: `colors.${color.id}.isDeleted`,
      value: true,
    }));
  }

  return (
    <Flex.Row key={color.id} align="center" gridGap="12px">
      <Swatch colorValue={localColor || color.value} />
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
        <Tooltip copy="Edit color" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.EditFill}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.blue[500]}
            aria-label="Edit color"
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          />
        </Tooltip>
        <Tooltip copy="Delete color" point={Tooltip.UP_RIGHT_ALIGNED}>
          <Buttons.IconButton
            IconComponent={Icons.TrashFill}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.red[500]}
            aria-label="Delete color"
            onClick={() => dispatch(setModal({
              type: CONFIRM_MODAL,
              props: {
                header: 'Are you sure you want to delete this color from the theme?',
                subheader: 'This action is not reversible.',
                confirmButtonLabel: 'Delete color',
                confirmButtonIconName: 'TrashFill',
                isDangerous: true,
                onConfirm: onDelete,
              },
            }))}
          />
        </Tooltip>
        {isColorPickerOpen && (
          <ColorPickerWrapper>
            <ChromePicker
              color={localColor || '#FFFFFF'}
              onChange={(output) => setLocalColor(parseColorPicker(output))}
              onChangeComplete={(output) => onColorChange(parseColorPicker(output))}
            />
          </ColorPickerWrapper>
        )}
      </Flex.Row>
    </Flex.Row>
  );
}

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
