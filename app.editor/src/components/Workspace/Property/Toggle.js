import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import { selectComponentPropertyStorageValue } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';


export default function Toggle(props) {
  const { fieldId, language, property } = props;
  const propertyId = get(property, 'id');
  const inheritFromSetting = get(property, 'inheritFromSetting', null);

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const getSetting = useGetSetting(activePageId);

  const inheritedFrom = useSelector(selectComponentPropertyStorageValue(
    activePageId,
    activeComponentId,
    propertyId,
    'inheritedFrom',
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

  const finalValue = !inheritedFrom ? value : (
    pullTranslatedValue(
      getSetting(inheritedFrom, inheritFromSetting),
      language,
    )
  );

  return (
    <Inputs.Toggle
      labelledBy={`${propertyId}-${Languages.US_ENGLISH_LANG}`}
      value={finalValue}
      setValue={setFieldValue}
      isDisabled={!!inheritedFrom}
    />
  );
}
