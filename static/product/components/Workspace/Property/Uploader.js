import React from 'react';
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import WorkspaceUploadField from '@product/components/Workspace/UploadField';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';

export default function Uploader(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');
  const allow = get(property, 'allow', []);

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

  return (
    <WorkspaceUploadField
      allow={allow}
      imageSource={finalValue}
      setImageSource={(source) => setFieldValue(source)}
    />
  );
}
