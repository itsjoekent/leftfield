import React from 'react';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import { FormWizardProvider, formActions } from 'pkg.form-wizard';
import WorkspacePropertyFormField from '@editor/components/Workspace/Property/FormField';
import {
  selectComponentProperties,
  setComponentInstancePropertyValue,
} from '@editor/features/assembly';
import { selectVisibleProperties } from '@editor/features/workspace';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function PropertiesForm() {
  const {
    activePageId,
    activeComponentId,
  } = useActiveWorkspaceComponent();

  const componentProperties = useSelector(selectComponentProperties(activePageId, activeComponentId));
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
        language: language,
      },
    })),
  ]), []);

  // TODO: Clear form values that get removed because of the 'conditional' changing...
  React.useEffect(() => {
    if (!apiRef.current || !fields.length) {
      return;
    }

    const { getFormState, dispatch: formDispatch } = apiRef.current;
    const formState = getFormState();

    fields.forEach((field) => {
      const propertyId = get(field, 'attributes.propertyId');
      const language = get(field, 'attributes.language');

      if (
        (typeof componentProperties[propertyId] !== 'undefined')
        && (componentProperties[propertyId] !== null)
      ) {
        const propertyValue = get(componentProperties, `${propertyId}.value`);
        const translatedValue = pullTranslatedValue(propertyValue, language) || '';

        if (formState.values[field.id] !== translatedValue) {
          formDispatch(formActions.setValue(
            field.id,
            translatedValue,
          ));
        }
      }
    });

    // TODO: Move to middleware???
    // Object.keys(formState.values).forEach((fieldId) => {
    //   const match = find(fields, { id: fieldId });
    //
    //   if (!match) {
    //     const [propertyId, language] = fieldId.split('-');
    //     console.log(
    //       propertyId,
    //       language,
    //       componentProperties,
    //       get(componentProperties, `${propertyId}.value.${language}`, null),
    //     );
    //
    //     if (get(componentProperties, `${propertyId}.value.${language}`, null) !== null) {
    //       console('wipe', propertyId);
    //
    //       dispatch(wipePropertyValue({
    //         pageId: activePageId,
    //         componentId: activeComponentId,
    //         propertyId,
    //       }));
    //     }
    //   }
    // });
  }, [
    activeComponentId,
    activePageId,
    componentProperties,
    dispatch,
    fields,
  ]);

  function onFieldSave(fieldId, value) {
    const field = find(fields, { id: fieldId });
    const propertyId = get(field, 'attributes.propertyId');
    const language = get(field, 'attributes.language');

    dispatch(setComponentInstancePropertyValue({
      pageId: activePageId,
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
