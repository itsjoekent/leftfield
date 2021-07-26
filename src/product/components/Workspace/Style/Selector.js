import React from 'react';
import Select from 'react-select';
import { find, get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive } from 'pkg.campaign-components';
import {
  selectCampaignTheme,
  selectComponentStyleAttributeForDeviceCascading,
  setComponentThemeStyle,
  setComponentCustomStyle,
  selectComponentStyle,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function Selector(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const componentStyle = useSelector(
    selectComponentStyle(activePageId, activeComponentId, styleId)
  );

  const campaignTheme = useSelector(selectCampaignTheme);
  const device = useSelector(selectPreviewDeviceSize);

  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const dynamicEvalData = {
    campaignTheme,
    styles: componentStyle,
  };

  const optionsFromTheme = get(attribute, 'optionsFromTheme');
  const hasOptionsFromTheme = !!optionsFromTheme;

  const options = get(attribute, 'options')
    || (hasOptionsFromTheme ? optionsFromTheme(dynamicEvalData) : []);

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const inheritFromTheme = get(attributeValue, 'inheritFromTheme', null);
  const custom = get(attributeValue, 'custom', null);

  const value = inheritFromTheme || custom;
  const action = hasOptionsFromTheme
    ? setComponentThemeStyle
    : setComponentCustomStyle;

  return (
    <Select
      value={find(options, { value })}
      options={options}
      isDisabled={notResponsive && device !== Responsive.MOBILE_DEVICE}
      onChange={({ value }) => dispatch(action({
        pageId: activePageId,
        componentId: activeComponentId,
        styleId,
        attributeId,
        device: targetDevice,
        value,
      }))}
    />
  );
}
