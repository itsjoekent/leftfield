import React from 'react';
import { get } from 'lodash';
import {
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { Languages, PropertyTypes } from 'pkg.campaign-components';
import { useFormField, FormWizardField } from 'pkg.form-wizard';
import WorkspaceFieldLabel from '@editor/components/Workspace/FieldLabel';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';

export default function FormField(props) {
  const { setting } = props;

  const settingId = get(setting, 'key');
  const primaryFieldId = `${settingId}-${Languages.US_ENGLISH_LANG}`;
  const { labelProps } = useFormField(primaryFieldId);

  const siteLanguages = useSiteLanguages();

  const isTranslatable = !!get(setting.field, 'isTranslatable', false);
  const languages = isTranslatable ? siteLanguages : [Languages.US_ENGLISH_LANG];

  return (
    <Flex.Column gridGap="8px">
      <WorkspaceFieldLabel
        labelProps={labelProps}
        help={get(setting, 'field.help')}
        hideRequiredStatus
      />
      {languages.map((language) => (
        <Flex.Column key={language} gridGap="4px">
          <FormWizardField fieldId={`${settingId}-${language}`}>
            {(field) => (
              <React.Fragment>
                {(() => {
                  switch (get(setting, 'field.type')) {
                    case PropertyTypes.URL_TYPE:
                    case PropertyTypes.SHORT_TEXT_TYPE: return (
                      <Inputs.DefaultText
                        {...field.inputProps}
                        {...field.inputStylingProps}
                         aria-labelledby={primaryFieldId}
                      />
                    );

                    default: return null;
                  }
                })()}
                <Flex.Row
                  fullWidth
                  align="center"
                  justify="flex-end"
                  gridGap="6px"
                >
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
                </Flex.Row>
              </React.Fragment>
            )}
          </FormWizardField>
        </Flex.Column>
      ))}
    </Flex.Column>
  );
}
