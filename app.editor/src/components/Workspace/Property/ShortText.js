import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import { selectComponentPropertyStorage } from '@editor/features/assembly';
import WorkspacePropertyInheritanceTextValue from '@editor/components/Workspace/Property/InheritanceTextValue';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function ShortText(props) {
  const { fieldId, language, property } = props;
  const propertyId = get(property, 'id');

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const inheritedFrom = useSelector(selectComponentPropertyStorage(
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
    inputProps,
    inputStylingProps,
    setFieldValue,
  } = field;

  if (!!inheritedFrom) {
    return (
      <WorkspacePropertyInheritanceTextValue
        inheritedFrom={inheritedFrom}
        inheritFromSetting={get(property, 'inheritFromSetting')}
        language={language}
        propertyId={propertyId}
        setFieldValue={setFieldValue}
      />
    );
  }

  const finalInputProps = {
    ...inputProps,
  };

  if (language !== Languages.US_ENGLISH_LANG) {
    finalInputProps['aria-labelledby'] = `${propertyId}-${Languages.US_ENGLISH_LANG}`;
  }

  return (
    <Inputs.DefaultText {...finalInputProps} {...inputStylingProps} />
  );
}
