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
import {
  selectComponentStyleAttributeForDeviceCascading,
  setComponentCustomStyle,
} from '@product/features/assembly';
import { selectPreviewDeviceSize } from '@product/features/previewMode';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useProductApi from '@product/hooks/useProductApi';

export default function Uploader(props) {
  const { styleId, attribute } = props;

  const attributeId = get(attribute, 'id');
  const allow = get(attribute, 'allow', []);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [isUploading, setIsUploading] = React.useState(false);

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

  function onError(error) {
    console.error(error);
    setIsUploading(false);
    dispatch(pushSnack({
      message: 'Error uploading image',
      type: SPICY_SNACK,
    }));
  }

  async function onUpload(event) {
    setIsUploading(true);

    try {
      const {
        fileData,
        mimeType,
        originalFileName,
      } = event;

      const imageId = uuid();

      await hitApi(
        'post',
        '/file',
        {
          fileData,
          fileName: imageId,
          originalFileName,
          mimeType,
          targetBucket: 'assets',
        },
        ({ ok, json }) => {
          setIsUploading(false);

          if (ok) {
            const { url: value } = json;

            dispatch(setComponentCustomStyle({
              pageId: activePageId,
              componentId: activeComponentId,
              styleId,
              attributeId,
              device: targetDevice,
              value,
            }));
          }
        },
      );
    } catch (error) {
      onError(error);
    }
  }

  const src = get(attributeValue, 'custom', '');

  return (
    <Inputs.FileUploader
      accepts={allow}
      onError={onError}
      onUpload={onUpload}
      src={src}
    >
      {(buttonProps) => (
        <Flex.Row gridGap="6px">
          <Buttons.Filled
            IconComponent={Icons.Upload}
            iconSize={20}
            gridGap="2px"
            paddingVertical="2px"
            paddingHorizontal="6px"
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => colors.blue[500]}
            hoverButtonBg={(colors) => colors.blue[700]}
            {...buttonProps}
          >
            <Typography
              fontStyle="bold"
              fontSize="14px"
            >
              Upload
            </Typography>
          </Buttons.Filled>
        </Flex.Row>
      )}
    </Inputs.FileUploader>
  );
}
