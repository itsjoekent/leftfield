import React from 'react';
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import { setModal, FILE_SELECTOR } from '@product/features/modal';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import useProductApi from '@product/hooks/useProductApi';
import isDefined from '@product/utils/isDefined';

export default function Uploader(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');
  const allow = get(property, 'allow', []);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [isUploading, setIsUploading] = React.useState(false);

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const getPropertyValue = useGetPropertyValue(activePageId, activeComponentId);

  const inheritedFrom = useSelector(selectComponentPropertyInheritedFromForLanguage(
    activePageId,
    activeComponentId,
    propertyId,
    language,
  ));

  const field = useFormField(fieldId);

  if (!field) {
    return null;
  }

  const {
    setFieldValue,
    value,
  } = field;

  const finalValue = isDefined(inheritedFrom)
    ? getPropertyValue(propertyId, language)
    : value;

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
            setFieldValue(value);
          }
        },
      );
    } catch (error) {
      onError(error);
    }
  }

  return (
    <Inputs.FileUploader
      accepts={allow}
      onError={onError}
      onUpload={onUpload}
      src={finalValue}
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
                onSelect: ({ fileKey }) => setFieldValue(`${process.env.FILES_DOMAIN}/file/${fileKey}`),
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
