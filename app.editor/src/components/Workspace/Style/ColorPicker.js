import React from 'react';
import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { ChromePicker } from 'react-color';
import { Responsive } from 'pkg.campaign-components';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
} from 'pkg.admin-components';
import {
  selectCampaignTheme,
  selectComponentStyleAttributeForDeviceCascading,
  setComponentInstanceCustomStyle,
  setComponentInstanceThemeStyle,
} from '@editor/features/assembly';
import { selectDeviceSize } from '@editor/features/previewMode';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function ColorPicker(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const campaignTheme = useSelector(selectCampaignTheme);

  const previewDevice = useSelector(selectDeviceSize);
  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : previewDevice;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const dispatch = useDispatch();

  const isCustom = !!get(attributeValue, 'custom');
  const customColorHex = get(attributeValue, 'custom', '#FFF');

  const [localCustomColor, setLocalCustomColor] = React.useState(isCustom ? customColorHex : null);
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);

  const colorPickerRef = React.useRef(null);

  React.useEffect(() => {
    if (!isColorPickerOpen) {
      return;
    }

    const colorPickerWrapperElement = colorPickerRef.current;

    function handleClickOutside(event) {
      if (!colorPickerWrapperElement) {
        return;
      }

      if (!colorPickerWrapperElement.contains(event.target)) {
        setIsColorPickerOpen(false);
      }
    }

    if (colorPickerWrapperElement) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (colorPickerWrapperElement) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [
    isColorPickerOpen,
  ]);

  function onThemeClick(colorId) {
    dispatch(setComponentInstanceThemeStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value: colorId,
    }));
  }

  function setCustomColor(hex) {
    dispatch(setComponentInstanceCustomStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value: hex,
    }));
  }

  return (
    <Flex.Row
      align="center"
      gridGap="6px"
      wrap="wrap"
    >
      {Object.keys(get(campaignTheme, 'colors')).map((colorId) => (
        <Tooltip
          key={colorId}
          copy={get(campaignTheme, `colors.${colorId}.label`)}
          point={Tooltip.UP}
        >
          <ColorButton
            aria-label={`Use ${get(campaignTheme, `colors.${colorId}.label`)}`}
            isSelected={get(attributeValue, 'inheritFromTheme') === colorId}
            colorValue={get(campaignTheme, `colors.${colorId}.value`, '#FFF')}
            onClick={() => onThemeClick(colorId)}
          >
            <Swatch colorValue={get(campaignTheme, `colors.${colorId}.value`, '#FFF')} />
          </ColorButton>
        </Tooltip>
      ))}
      <Flex.Row align="center" gridGap="6px" position="relative">
        {!!localCustomColor && (
          <Tooltip copy="Custom Color" point={Tooltip.UP}>
            <ColorButton
              aria-label={`Use custom color`}
              isSelected={isCustom}
              colorValue={localCustomColor}
              onClick={() => setCustomColor(localCustomColor)}
            >
              <Swatch colorValue={localCustomColor} />
            </ColorButton>
          </Tooltip>
        )}
        {isColorPickerOpen && (
          <ColorPickerWrapper ref={colorPickerRef}>
            <ChromePicker
              color={localCustomColor || '#FFFFFF'}
              onChange={({ hex }) => setLocalCustomColor(hex)}
              onChangeComplete={({ hex }) => {
                setLocalCustomColor(hex);
                setCustomColor(hex);
              }}
            />
          </ColorPickerWrapper>
        )}
        <Tooltip
          copy={!!localCustomColor ? 'Edit custom color' : 'Add custom color'}
          point={Tooltip.UP}
        >
          <Buttons.IconButton
            IconComponent={!!localCustomColor ? Icons.EditFill : Icons.AddSquareFill}
            width={24}
            height={24}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.blue[700]}
            aria-label={localCustomColor ? 'Edit custom color' : 'Add custom color'}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          />
        </Tooltip>
      </Flex.Row>
    </Flex.Row>
  );
}

const ColorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  width: 28px;
  height: 28px;

  padding: 0;
  border-radius: 50%;
  border: 3px solid ${(props) => props.theme.colors.mono[200]};
  cursor: pointer;

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: border-color, box-shadow;

  &:hover {
    border: 3px solid ${(props) => props.theme.colors.mono[400]};
  }

  ${(props) => props.isSelected && css`
    border: 3px solid ${(props) => props.colorValue};
    ${(props) => props.theme.shadow.light}

    &:hover {
      border: 3px solid ${(props) => props.colorValue};
    }
  `}
`;

const Swatch = styled.span`
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.colorValue};
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
`;
