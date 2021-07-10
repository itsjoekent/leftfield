import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormField } from 'pkg.form-wizard';
import { Languages } from 'pkg.campaign-components';
import { Inputs } from 'pkg.admin-components';
import { selectComponentPropertyInheritedFromForLanguage } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useGetSetting from '@editor/hooks/useGetSetting';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function ShortText(props) {
  const { fieldId, language, property } = props;

  const propertyId = get(property, 'id');
  const inheritFromSetting = get(property, 'inheritFromSetting', null);

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const getSetting = useGetSetting(activePageId);

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
    const value = pullTranslatedValue(
      getSetting(inheritedFrom, inheritFromSetting),
      language,
    );

    finalInputProps['disabled'] = true;
    finalInputProps['value'] = value;
  }

  return (
    <Inputs.DefaultText {...finalInputProps} {...inputStylingProps} />
  );
}
