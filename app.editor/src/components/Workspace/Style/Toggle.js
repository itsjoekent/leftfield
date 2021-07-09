import React from 'react';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Inputs } from 'pkg.admin-components';
import { Responsive } from 'pkg.campaign-components';
import {
  selectComponentStyleAttributeForDeviceCascading,
  setComponentInstanceCustomStyle,
} from '@editor/features/assembly';
import { selectDeviceSize } from '@editor/features/previewMode';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function Toggle(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');

  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const device = useSelector(selectDeviceSize);

  const notResponsive = get(attribute, 'notResponsive', false);
  const targetDevice = notResponsive ? Responsive.MOBILE_DEVICE : device;

  const attributeValue = useSelector(selectComponentStyleAttributeForDeviceCascading(
    activePageId,
    activeComponentId,
    styleId,
    attributeId,
    targetDevice,
  ));

  const customValue = get(attributeValue, 'custom', 0);

  function onChange(value) {
    dispatch(setComponentInstanceCustomStyle({
      pageId: activePageId,
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
