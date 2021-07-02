import React from 'react';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import { Languages } from 'pkg.campaign-components';
import { FormWizardProvider, formActions } from 'pkg.form-wizard';
import WorkspacePropertyFormField from '@editor/components/Workspace/Property/FormField';
import {
  selectComponentProperties,
  setComponentInstancePropertyValue,
} from '@editor/features/assembly';
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

  const dynamicPropertyEvaluation = useDynamicPropertyEvaluation(activePageId, activeComponentId);
  const languages = useSiteLanguages();

  const apiRef = React.useRef(null);
  const dispatch = useDispatch();

  const { fields, fieldProperties } = propertyMeta.reduce((acc, property) => {
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
          language: Languages.US_ENGLISH_LANG,
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

    return {
      fields: [
        ...acc.fields,
        ...append,
      ],
      fieldProperties: [
        ...acc.fieldProperties,
        property,
      ],
    };
  }, {
    fields: [],
    fieldProperties: [],
  });

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
  }, [
    fields,
    componentProperties,
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
          {fieldProperties.map((property) => (
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
