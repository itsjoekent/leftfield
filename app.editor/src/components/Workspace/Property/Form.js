import React from 'react';
import { find, get } from 'lodash';
import { useSelector } from 'react-redux';
import { Flex } from 'pkg.admin-components';
import { Languages, PropertyTypes } from 'pkg.campaign-components';
import {
  FormWizardProvider,
  FormWizardFields,
} from 'pkg.form-wizard';
import WorkspaceFieldLabel from '@editor/components/Workspace/FieldLabel';
import WorkspacePropertyShortText from '@editor/components/Workspace/Property/ShortText';
import WorkspacePropertyInheritance from '@editor/components/Workspace/Property/Inheritance';
import { selectComponentProperties } from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';

export default function PropertiesForm() {
  const {
    activePageId,
    activeComponentId,
    activeComponentMeta,
  } = useActiveWorkspaceComponent();

  const properties = useSelector(selectComponentProperties(activePageId, activeComponentId));
  const propertyMeta = get(activeComponentMeta, 'properties', null);

  if (!propertyMeta) {
    return null;
  }

  const fields = propertyMeta.map((property) => ({
    id: property.id,
    label: property.label,
  }));

  function getPropertyById(propertyId) {
    return find(propertyMeta, { id: propertyId });
  }

  function getPropertyKeyValue(propertyId, key, defaultValue = null) {
    return get(getPropertyById(propertyId), key, defaultValue);
  }

  return (
    <FormWizardProvider
      name={`component-${activeComponentId}-properties`}
      fields={fields}
    >
      {(formProps) => (
        <Flex.Column gridGap="16px" as="form" {...formProps}>
          <FormWizardFields>
            {({
              field,
              inputProps,
              labelProps,
            }) => (
              <Flex.Column gridGap="8px">
                <WorkspaceFieldLabel
                  isRequired={getPropertyKeyValue(field.id, 'required', false)}
                  help={getPropertyKeyValue(field.id, 'help', null)}
                  labelProps={labelProps}
                />
                <Flex.Column gridGap="2px">
                  <WorkspacePropertyShortText
                    inputProps={inputProps}
                    property={getPropertyById(field.id)}
                  />
                  {(() => {
                    const hasInheritance = !!get(getPropertyById(field.id), 'inheritFromSetting', null);

                    if (!hasInheritance) {
                      return null;
                    }

                    return (
                      <Flex.Row align="center" justify="space-between" fullWidth>
                        {hasInheritance && (
                          <WorkspacePropertyInheritance
                            property={getPropertyById(field.id)}
                            language={Languages.US_ENGLISH_LANG}
                          />
                        )}
                      </Flex.Row>
                    );
                  })()}
                </Flex.Column>
              </Flex.Column>
            )}
          </FormWizardFields>
        </Flex.Column>
      )}
    </FormWizardProvider>
  );
}
