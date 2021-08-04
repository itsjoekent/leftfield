import React from 'react';
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive } from 'pkg.campaign-components';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import WorkspaceUploadField from '@product/components/Workspace/UploadField';
import {
  selectComponentStyleAttributeForDeviceCascading,
  setComponentCustomStyle,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';

export default function Uploader(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');
  const allow = get(attribute, 'allow', []);

  const dispatch = useDispatch();

  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

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

  const imageSource = get(attributeValue, 'custom', '');

  return (
    <WorkspaceUploadField
      allow={allow}
      imageSource={imageSource}
      setImageSource={(source) => dispatch(setComponentCustomStyle({
        pageId: activePageId,
        componentId: activeComponentId,
        styleId,
        attributeId,
        device: targetDevice,
        value: source,
      }))}
    />
  );
}
