import React from 'react';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Inputs } from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
import {
  selectComponentStyleAttributeForDeviceCascading,
  setComponentCustomStyle,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function Toggle(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();

  const {
    activePageRoute,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const device = useSelector(selectPreviewDeviceSize);

  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageRoute,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const customValue = get(attributeValue, 'custom', 0);

  function onChange(value) {
    dispatch(setComponentCustomStyle({
      route: activePageRoute,
      componentId: activeComponentId,
      styleId,
      attributeId,
      device: targetDevice,
      value,
    }));
  }

  return (
    <Inputs.Toggle
      value={customValue}
      setValue={onChange}
    />
  );
}
