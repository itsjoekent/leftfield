import React from 'react';
import { get } from 'lodash';
import { Flex, Typography } from 'pkg.admin-components';
import { Languages } from 'pkg.campaign-components';
import WorkspacePropertyInheritance from '@editor/components/Workspace/Property/Inheritance';
import WorkspacePropertyLabel from '@editor/components/Workspace/Property/Label';
import WorkspacePropertyShortText from '@editor/components/Workspace/Property/ShortText';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';

function FormFieldInner(props) {
  const {
    fieldId,
    isTranslatable,
    language,
    property,
  } = props;

  return (
    <Flex.Column gridGap="2px">
      <WorkspacePropertyShortText
        fieldId={fieldId}
        language={language}
        property={property}
      />
      {(() => {
        const hasInheritance = !!get(property, 'inheritFromSetting', null);

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
    </Flex.Column>
  );
}

export default function FormField(props) {
  const { property } = props;

  const isTranslatable = !!get(property, 'isTranslatable', false);

  const primaryFieldId = isTranslatable
    ? `${property.id}-${Languages.US_ENGLISH_LANG}`
    : property.id;

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
