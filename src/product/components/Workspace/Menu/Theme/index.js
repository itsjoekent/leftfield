import React from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';
import WorkspaceMenuAccordion from '@product/components/Workspace/Menu/Accordion';
import WorkspaceMenuThemeColor from '@product/components/Workspace/Menu/Theme/Color';
import {
  setCampaignThemeKeyValue,
  selectCampaignThemeColorsAsSortedArray,
  selectCampaignThemeColorSortOrder,
} from '@product/features/assembly';

export default function Theme(props) {
  const {
    isExpanded,
    setIsExpanded,
  } = props;

  const dispatch = useDispatch();

  const campaignThemeColors = useSelector(selectCampaignThemeColorsAsSortedArray);
  const colorSortOrder = useSelector(selectCampaignThemeColorSortOrder);

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

    dispatch(setCampaignThemeKeyValue({
      path: 'meta.colorSortOrder',
      value: [id, ...colorSortOrder],
    }));
  }

  return (
    <WorkspaceMenuAccordion
      title="Campaign Theme"
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    >
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
        {campaignThemeColors.map((color) => (
          <WorkspaceMenuThemeColor key={color.id} color={color} />
        ))}
      </Flex.Column>
    </WorkspaceMenuAccordion>
  );
}
