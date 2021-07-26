import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Flex, Typography } from 'pkg.admin-components';
import { Languages, PropertyTypes } from 'pkg.campaign-components';
import WorkspacePropertyChecklist from '@product/components/Workspace/Property/Checklist';
import WorkspacePropertyInheritance from '@product/components/Workspace/Property/Inheritance';
import WorkspacePropertyLabel from '@product/components/Workspace/Property/Label';
import WorkspacePropertyShortText from '@product/components/Workspace/Property/ShortText';
import WorkspacePropertyTextMarkup from '@product/components/Workspace/Property/TextMarkup';
import WorkspacePropertyToggle from '@product/components/Workspace/Property/Toggle';
import useSiteLanguages from '@product/hooks/useSiteLanguages';
import isDefined from '@product/utils/isDefined';

function FormFieldInner(props) {
  const {
    fieldId,
    isTranslatable,
    language,
    property,
  } = props;

  const inheritFromSetting = !!get(property, 'inheritFromSetting', null);
  const hasInheritance = isDefined(inheritFromSetting);

  return (
    <FormFieldInnerContainer gridGap="4px">
      {(() => {
        switch (get(property, 'type')) {
          case PropertyTypes.CHECKLIST_TYPE: return (
            <WorkspacePropertyChecklist
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );

          case PropertyTypes.SHORT_TEXT_TYPE: return (
            <WorkspacePropertyShortText
              fieldId={fieldId}
              language={language}
              property={property}
            />
          );

          case PropertyTypes.TEXT_MARKUP: return (
            <WorkspacePropertyTextMarkup
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
  const primaryFieldId = `${property.id}-${Languages.US_ENGLISH_LANG}`;

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
