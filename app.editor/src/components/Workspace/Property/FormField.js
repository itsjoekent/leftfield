import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Flex, Typography } from 'pkg.admin-components';
import { Languages, PropertyTypes } from 'pkg.campaign-components';
import WorkspacePropertyChecklist from '@editor/components/Workspace/Property/Checklist';
import WorkspacePropertyInheritance from '@editor/components/Workspace/Property/Inheritance';
import WorkspacePropertyLabel from '@editor/components/Workspace/Property/Label';
import WorkspacePropertyShortText from '@editor/components/Workspace/Property/ShortText';
import WorkspacePropertyToggle from '@editor/components/Workspace/Property/Toggle';
import {
  selectComponentInstanceOf,
  selectLibraryComponentProperty,
} from '@editor/features/assembly';
import useActiveWorkspaceComponent from '@editor/hooks/useActiveWorkspaceComponent';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

function FormFieldInner(props) {
  const {
    fieldId,
    isTranslatable,
    language,
    property,
  } = props;

  const { activePageId, activeComponentId } = useActiveWorkspaceComponent();

  const instanceOf = useSelector(selectComponentInstanceOf(activePageId, activeComponentId));
  const instanceProperty = useSelector(selectLibraryComponentProperty(instanceOf, property.id));

  const inheritFromSetting = !!get(property, 'inheritFromSetting', null);
  const hasInheritance = isDefined(inheritFromSetting) || (
    isDefined(instanceOf)
    && (
      isDefined(pullTranslatedValue(get(instanceProperty, 'value'), language))
      || isDefined(pullTranslatedValue(get(instanceProperty, 'inheritedFrom'), language))
    )
  );

  return (
    <FormFieldInnerContainer gridGap="4px">
      {(() => {
        switch (get(property, 'type')) {
          case PropertyTypes.SHORT_TEXT_TYPE: return (
            <WorkspacePropertyShortText
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );

          case PropertyTypes.TOGGLE_TYPE: return (
            <WorkspacePropertyToggle
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );

          case PropertyTypes.CHECKLIST_TYPE: return (
            <WorkspacePropertyChecklist
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );

          default: return (
            <WorkspacePropertyShortText
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );
        }
      })()}
      {(() => {
        if (!hasInheritance && !isTranslatable) {
          return null;
        }

        const rowProps = {
          align: 'center',
          fullWidth: true,
        };

        if (!isTranslatable) {
          rowProps.justify = 'flex-start';
        } else if (hasInheritance) {
          rowProps.justify = 'space-between';
        } else {
          rowProps.justify = 'flex-end';
        }

        return (
          <Flex.Row {...rowProps}>
            {hasInheritance && (
              <WorkspacePropertyInheritance
                property={property}
                language={language}
                fieldId={fieldId}
              />
            )}
            {isTranslatable && (
              <Flex.Row
                paddingVeritcal="2px"
                paddingHorizontal="6px"
                bg={(colors) => colors.mono[200]}
                rounded={(radius) => radius.default}
              >
                <Typography
                  fontStyle="light"
                  fontSize="11px"
                  fg={(colors) => colors.mono[500]}
                >
                  {Languages.labels[language]}
                </Typography>
              </Flex.Row>
            )}
          </Flex.Row>
        );
      })()}
    </FormFieldInnerContainer>
  );
}

const FormFieldInnerContainer = styled(Flex.Column)`
  &:not(:last-child):not(:first-child) {
    margin-bottom: 6px;
  }
`;

export default function FormField(props) {
  const { property } = props;

  const isTranslatable = !!get(property, 'isTranslatable', false);
  const primaryFieldId = `${property.id}-${Languages.US_ENGLISH_LANG}`

  const languages = useSiteLanguages();

  return (
    <Flex.Column gridGap="8px">
      <WorkspacePropertyLabel
        fieldId={primaryFieldId}
        property={property}
      />
      {isTranslatable && languages.map((language) => (
        <FormFieldInner
          key={language}
          isTranslatable
          fieldId={`${property.id}-${language}`}
          language={language}
          property={property}
        />
      ))}
      {!isTranslatable && (
        <FormFieldInner
          fieldId={primaryFieldId}
          language={Languages.US_ENGLISH_LANG}
          property={property}
        />
      )}
    </Flex.Column>
  );
}
