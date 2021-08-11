import React from 'react';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import { FormWizardProvider, formActions } from 'pkg.form-wizard';
import WorkspacePropertyFormField from '@product/components/Workspace/Property/FormField';
import {
  selectComponentProperties,
  setComponentPropertyValue,
} from '@product/features/assembly';
import { selectVisibleProperties } from '@product/features/workspace';
import useActiveWorkspaceComponent from '@product/hooks/useActiveWorkspaceComponent';
import useSiteLanguages from '@product/hooks/useSiteLanguages';
import isDefined from '@product/utils/isDefined';
import pullTranslatedValue from '@product/utils/pullTranslatedValue';

export default function PropertiesForm() {
  const {
    activePageRoute,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const componentProperties = useSelector(selectComponentProperties(activePageRoute, activeComponentId));
  const visibleProperties = useSelector(selectVisibleProperties);

  const languages = useSiteLanguages();

  const apiRef = React.useRef(null);
  const dispatch = useDispatch();

  const fields = visibleProperties.reduce((acc, property) => ([
    ...acc,
    ...languages.map((language) => ({
      id: `${property.id}-${language}`,
      label: property.label,
      attributes: {
        propertyId: property.id,
        language,
      },
    })),
  ]), []);

  React.useEffect(() => {
    if (!apiRef.current || !fields.length) {
      return;
    }

    const { getFormState, dispatch: formDispatch } = apiRef.current;
    const formState = getFormState();

    fields.forEach((field) => {
      const propertyId = get(field, 'attributes.propertyId');
      const language = get(field, 'attributes.language');
      const propertyValue = pullTranslatedValue(get(componentProperties, `${propertyId}.value`), language);

      if (isDefined(propertyValue) && formState.values[field.id] !== propertyValue) {
        formDispatch(formActions.setValue(
          field.id,
          propertyValue,
        ));
      }
    });
  }, [
    componentProperties,
    fields,
  ]);

  function onFieldSave(fieldId, value) {
    const field = find(fields, { id: fieldId });
    const propertyId = get(field, 'attributes.propertyId');
    const language = get(field, 'attributes.language');

    dispatch(setComponentPropertyValue({
      route: activePageRoute,
      componentId: activeComponentId,
      propertyId,
      value,
      language,
    }));
  }

  return (
    <FormWizardProvider
      name={`component-${activeComponentId}-properties`}
      fields={fields}
      apiRef={apiRef}
      onFieldSave={onFieldSave}
    >
      {(formProps) => (
        <Flex.Column gridGap="24px" as="form" {...formProps}>
          {visibleProperties.map((property) => (
            <WorkspacePropertyFormField
              key={property.id}
              property={property}
            />
          ))}
        </Flex.Column>
      )}
    </FormWizardProvider>
  );
}
