import React from 'react';
import Select from 'react-select';
import { find, get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Responsive } from 'pkg.campaign-components';
import {
  selectCampaignTheme,
  selectComponentStyleAttributeForDeviceCascading,
  setComponentThemeStyle,
  selectComponentStyle,
} from '@editor/features/assembly';
import { selectDeviceSize } from '@editor/features/previewMode';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

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
  const device = useSelector(selectDeviceSize);

  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const dynamicEvalData = {
    campaignTheme,
    styles: componentStyle,
  };

  const options = get(attribute, 'options')
    || get(attribute, 'optionsFromTheme', () => [])(dynamicEvalData);

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const inheritFromTheme = get(attributeValue, 'inheritFromTheme', null);

  return (
    <Select
      value={find(options, { value: inheritFromTheme })}
      options={options}
      isDisabled={notResponsive && device !== Responsive.MOBILE_DEVICE}
      onChange={({ value }) => dispatch(setComponentThemeStyle({
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
