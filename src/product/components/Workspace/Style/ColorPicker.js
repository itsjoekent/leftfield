import React from 'react';
import styled from 'styled-components';
import { find, get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { ChromePicker } from 'react-color';
import { Responsive } from 'pkg.campaign-components';
import {
  Buttons,
  Flex,
  Grid,
  Icons,
  Typography,
  useAdminTheme,
} from 'pkg.admin-components';
import {
  resetComponentStyleAttribute,
  selectCampaignThemeColorsAsSortedArray,
  selectComponentStyleAttributeForDeviceCascading,
  setComponentCustomStyle,
  setComponentThemeStyle,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useClickOutside from '@product/hooks/useClickOutside';
import parseColorPicker from '@product/utils/parseColorPicker';

export default function ColorPicker(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const campaignThemeColors = useSelector(selectCampaignThemeColorsAsSortedArray);

  const previewDevice = useSelector(selectPreviewDeviceSize);
  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : previewDevice;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const inheritFromTheme = get(attributeValue, 'inheritFromTheme');

  const dispatch = useDispatch();
  const adminTheme = useAdminTheme();

  const isCustom = !!get(attributeValue, 'custom');
  const customColorValue = get(attributeValue, 'custom', '#FFF');

  const [localCustomColor, setLocalCustomColor] = React.useState(isCustom ? customColorValue : null);
  const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!localCustomColor && isCustom) {
      setLocalCustomColor(customColorValue);
    }
  }, [isCustom, customColorValue, localCustomColor]);

  const colorPickerRef = useClickOutside(() => {
    if (isColorPickerOpen) {
      setIsColorPickerOpen(false);
    }
  }, [isColorPickerOpen]);

  function resetColor() {
    dispatch(resetComponentStyleAttribute({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
    }));
  }

  function onThemeClick(colorId) {
    if (inheritFromTheme === colorId) {
      resetColor();
      return;
    }

    dispatch(setComponentThemeStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value: colorId,
    }));
  }

  function setCustomColor(value) {
    dispatch(setComponentCustomStyle({
      pageId: activePageId,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value,
    }));
  }

  const customColorButtonLabel = localCustomColor ? 'Edit custom color' : 'Add custom color';

  const isArchivedColor = !!inheritFromTheme
    && !find(campaignThemeColors, { id: inheritFromTheme });

  return (
    <Flex.Column gridGap="12px">
      {!!isArchivedColor && (
        <Flex.Row align="center" gridGap="2px">
          <Icons.AlarmFill
            width={20}
            height={20}
            color={adminTheme.colors.red[500]}
          />
          <Typography
            fontStyle="medium"
            fontSize="14px"
            fg={(colors) => colors.red[500]}
          >
            Using an archived color
          </Typography>
        </Flex.Row>
      )}
      <Grid fullWidth columns="1fr 1fr" gap="12px">
        {campaignThemeColors.map((color) => {
          const colorId = get(color, 'id');
          const colorValue = get(color, 'value', '#FFF');
          const label = get(color, 'label', 'N/A');
          const isSelected = inheritFromTheme === colorId;

          return (
            <Buttons.Outline
              key={colorId}
              fullWidth
              gridGap="6px"
              justify="flex-start"
              padding="4px"
              overflow="hidden"
              bg={(colors) => colors.mono[100]}
              borderWidth="2px"
              borderColor={(colors) => isSelected ? colors.blue[500] : colors.mono[500]}
              hoverBorderColor={(colors) => isSelected ? colors.blue[800] : colors.mono[900]}
              onClick={() => onThemeClick(colorId)}
            >
              <Swatch colorValue={colorValue} />
              <Typography
                fontStyle="medium"
                fontSize="14px"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {label}
              </Typography>
            </Buttons.Outline>
          );
        })}
        {!!localCustomColor && (
          <Buttons.Outline
            fullWidth
            gridGap="6px"
            justify="flex-start"
            padding="4px"
            overflow="hidden"
            bg={(colors) => colors.mono[100]}
            borderWidth="2px"
            borderColor={(colors) => isCustom ? colors.blue[500] : colors.mono[500]}
            hoverBorderColor={(colors) => isCustom ? colors.blue[800] : colors.mono[900]}
            onClick={() => {
              if (isCustom) {
                resetColor();
                return;
              }

              setCustomColor(localCustomColor);
            }}
          >
            <Swatch colorValue={localCustomColor} />
            <Typography
              fontStyle="medium"
              fontSize="14px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              Custom color
            </Typography>
          </Buttons.Outline>
        )}
      </Grid>
      <Flex.Column
        ref={colorPickerRef}
        position="relative"
        fitContent
      >
        <Buttons.Outline
          fullWidth
          padding="4px"
          bg={(colors) => colors.mono[200]}
          borderWidth="2px"
          borderColor={(colors) => colors.mono[600]}
          hoverBorderColor={(colors) => colors.mono[900]}
          gridGap="2px"
          IconComponent={!!localCustomColor ? Icons.EditFill : Icons.AddRound}
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
          <ColorPickerWrapper>
            <ChromePicker
              color={localCustomColor || '#FFFFFF'}
              onChange={(output) => setLocalCustomColor(parseColorPicker(output))}
              onChangeComplete={(output) => {
                const value = parseColorPicker(output);
                setLocalCustomColor(value);
                setCustomColor(value);
              }}
            />
          </ColorPickerWrapper>
        )}
      </Flex.Column>
    </Flex.Column>
  );
}

const Swatch = styled.span`
  display: block;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.mono[700]};
  background-color: ${(props) => props.colorValue};
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
`;
