import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import {
  selectComponentPropertyInheritedFromForLanguage,
} from '@product/features/assembly';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useGetPropertyValue from '@product/hooks/useGetPropertyValue';
import isDefined from '@product/utils/isDefined';

export default function ShortText(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');

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
    inputProps,
    inputStylingProps,
  } = field;

  const finalInputProps = {
    ...inputProps,
    'aria-labelledby': `${propertyId}-${Languages.US_ENGLISH_LANG}`,
  };

  if (isDefined(inheritedFrom)) {
    const value = getPropertyValue(propertyId, language);

    finalInputProps['disabled'] = true;
    finalInputProps['value'] = value;
  }

  return (
    <Inputs.DefaultText {...finalInputProps} {...inputStylingProps} />
  );
}
