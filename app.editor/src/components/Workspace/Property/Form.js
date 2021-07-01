import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import { FormWizardProvider, formActions } from 'pkg.form-wizard';
import WorkspacePropertyFormField from '@editor/components/Workspace/Property/FormField';
import { selectComponentProperties } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useDynamicPropertyEvaluation from '@editor/hooks/useDynamicPropertyEvaluation';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function PropertiesForm() {
  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const componentProperties = useSelector(selectComponentProperties(activePageId, activeComponentId));

  const propertyMeta = get(activeComponentMeta, 'properties', []);

  const dynamicPropertyEvaluation = useDynamicPropertyEvaluation();
  const languages = useSiteLanguages();

  const apiRef = React.useRef(null);

  const fields = propertyMeta.reduce((acc, property) => {
    const isTranslatable = get(property, 'isTranslatable', false);
    const hasConditional = !!get(property, 'conditional', null);

    if (hasConditional) {
      const [conditional] = dynamicPropertyEvaluation(property, ['conditional']);

      if (!conditional) {
        return acc;
      }
    }

    const append = [];

    if (!isTranslatable) {
      append.push({
        id: property.id,
        label: property.label,
        attributes: {
          propertyId: property.id,
        },
      });
    } else {
      languages.forEach((lang) => {
        append.push({
          id: `${property.id}-${lang}`,
          label: property.label,
          attributes: {
            propertyId: property.id,
            language: lang,
          },
        });
      });
    }

    return [
      ...acc,
      ...append,
    ];
  }, []);

  React.useEffect(() => {
    if (!apiRef.current || !fields.length) {
      return;
    }

    const { getFormState, dispatch: formDispatch } = apiRef.current;
    const formState = getFormState();

    fields.forEach((field) => {
      if (typeof formState.values[field.id] !== 'undefined') {
        return;
      }

      const propertyId = get(field, 'attributes.propertyId');
      const language = get(field, 'attributes.language');

      if (
        (typeof componentProperties[propertyId] !== 'undefined')
        && (componentProperties[propertyId] !== null)
      ) {
        const propertyValue = get(componentProperties, `${propertyId}.value`);

        if (language) {
          formDispatch(formActions.setValue(
            field.id,
            pullTranslatedValue(propertyValue, language) || '',
          ));
        } else {
          formDispatch(formActions.setValue(
            field.id,
            propertyValue || '',
          ));
        }
      }
    });
  }, [
    fields,
    componentProperties,
  ]);

  return (
    <FormWizardProvider
      name={`component-${activeComponentId}-properties`}
      fields={fields}
      apiRef={apiRef}
    >
      {(formProps) => (
        <Flex.Column gridGap="16px" as="form" {...formProps}>
          {propertyMeta.map((property) => (
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
