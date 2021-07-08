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
  Typography,
} from 'pkg.admin-components';
import {
  selectCampaignTheme,
  selectComponentStyleAttributeForDeviceCascading,
  setComponentInstanceStyle,
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

  function resetColor() {
    dispatch(setComponentInstanceStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value: {},
    }));
  }

  function onThemeClick(colorId) {
    if (get(attributeValue, 'inheritFromTheme') === colorId) {
      resetColor();
      return;
    }

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

  const customColorButtonLabel = localCustomColor ? 'Edit custom color' : 'Add custom color';

  return (
    <Flex.Column gridGap="12px">
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
        {!!localCustomColor && (
          <Tooltip copy="Custom Color" point={Tooltip.UP}>
            <ColorButton
              aria-label={`Use custom color`}
              isSelected={isCustom}
              colorValue={localCustomColor}
              onClick={() => {
                if (isCustom) {
                  resetColor();
                  return;
                }

                setCustomColor(localCustomColor);
              }}
            >
              <Swatch colorValue={localCustomColor} />
            </ColorButton>
          </Tooltip>
        )}
      </Flex.Row>
      <Flex.Column position="relative" fitContent>
        <Buttons.Outline
          paddingVertical="2px"
          paddingHorizontal="4px"
          bg={(colors) => colors.mono[200]}
          borderWidth="1px"
          borderColor={(colors) => colors.mono[600]}
          hoverBorderColor={(colors) => colors.mono[900]}
          gridGap="2px"
          IconComponent={!!localCustomColor ? Icons.EditFill : Icons.AddSquareFill}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        >
          <Typography
            fontStyle="regular"
            fontSize="14px"
          >
            {customColorButtonLabel}
          </Typography>
        </Buttons.Outline>
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
      </Flex.Column>
    </Flex.Column>
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
  top: 36px;
  left: 0;
  ${'' /* left: 50%;
  transform: translateX(-50%); */}
`;
