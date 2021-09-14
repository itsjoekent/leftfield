import React from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { setModal, FILE_SELECTOR } from '@product/features/modal';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';

export default function Uploader(props) {
  const {
    allow,
    imageSource,
    setImageSource,
  } = props;

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [isUploading, setIsUploading] = React.useState(false);

  function onError(error) {
    console.error(error);
    setIsUploading(false);
    dispatch(pushSnack({
      message: 'Error uploading image',
      type: SPICY_SNACK,
    }));
  }

  function onUpload(event) {
    setIsUploading(true);

    const {
      file,
      fileSize,
      mimeType,
      originalFileName,
    } = event;

    hitApi({
      method: 'post',
      route: '/file',
      payload: {
        fileSize,
        mimeType,
        originalFileName,
        targetBucket: 'assets',
      },
      onResponse: ({ ok, json }) => {
        if (ok) {
          const { key, meta, uploadUrl, url } = json;

          fetch(uploadUrl, {
            method: 'put',
            headers: {
              'Content-Type': mimeType,
            },
            body: file,
          }).then((response) => {
            if (response.ok) {
              setImageSource(url);
              setIsUploading(false);
            } else {
              throw new Error(`Failed to upload to S3, ${response.status}`);
            }
          }).catch((error) => {
            setIsUploading(false);
            onError(error);
          });
        } else {
          setIsUploading(false);
        }
      },
      onFatalError: () => setIsUploading(false),
    });
  }

  function onSelect(file) {
    const fileKey = get(file, 'fileKey');

    if (fileKey) {
      setImageSource(`${process.env.EDGE_DOMAIN}/_lf/file/${fileKey}`);
    }
  }

  return (
    <Inputs.FileUploader
      accepts={allow}
      onError={onError}
      onUpload={onUpload}
      src={imageSource}
    >
      {(buttonProps) => (
        <Flex.Row gridGap="6px">
          <Buttons.Filled
            type="button"
            IconComponent={Icons.Upload}
            iconSize={20}
            gridGap="2px"
            paddingVertical="2px"
            paddingHorizontal="6px"
            buttonFg={(colors) => colors.mono[100]}
            buttonBg={(colors) => colors.blue[500]}
            hoverButtonBg={(colors) => colors.blue[700]}
            isLoading={isUploading}
            {...buttonProps}
          >
            <Typography
              fontStyle="bold"
              fontSize="14px"
            >
              Upload
            </Typography>
          </Buttons.Filled>
          <Buttons.Filled
            type="button"
            IconComponent={Icons.BookOpen}
            iconSize={20}
            gridGap="2px"
            paddingVertical="2px"
            paddingHorizontal="6px"
            buttonFg={(colors) => colors.mono[700]}
            buttonBg={(colors) => colors.mono[300]}
            hoverButtonBg={(colors) => colors.mono[400]}
            fullWidth
            onClick={() => dispatch(setModal({
              type: FILE_SELECTOR,
              props: {
                accepts: allow,
                onSelect,
              },
            }))}
          >
            <Typography
              fontStyle="bold"
              fontSize="14px"
            >
              Media
            </Typography>
          </Buttons.Filled>
        </Flex.Row>
      )}
    </Inputs.FileUploader>
  );
}
