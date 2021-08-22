import React from 'react';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import Avatar from '@product/components/Avatar';
import useProductApi from '@product/hooks/useProductApi';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';

export default function AccountAvatar(props) {
  const { avatarSrc, name, setAvatar } = props;

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
        targetBucket: 'accounts',
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
          }).then(() => {
            setAvatar(url);
            setIsUploading(false);
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

  return (
    <Flex.Row align="center" gridGap="8px">
      <Avatar
        size={64}
        avatarSrc={avatarSrc}
        name={name}
      />
      <Inputs.FileUploader
        accepts={[
          'image/jpeg',
          'image/png',
        ]}
        onError={onError}
        onUpload={onUpload}
        src={null}
      >
        {(buttonProps) => (
          <Buttons.Filled
            {...buttonProps}
            fitWidth
            IconComponent={Icons.Upload}
            iconSize={20}
            gridGap="2px"
            paddingVertical="2px"
            paddingHorizontal="6px"
            buttonFg={(colors) => colors.mono[700]}
            buttonBg={(colors) => colors.mono[300]}
            hoverButtonBg={(colors) => colors.mono[400]}
            isLoading={isUploading}
          >
            <Typography
              fontStyle="bold"
              fontSize="14px"
            >
              Upload image
            </Typography>
          </Buttons.Filled>
        )}
      </Inputs.FileUploader>
    </Flex.Row>
  );
}
