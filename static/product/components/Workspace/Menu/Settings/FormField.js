import React from 'react';
import Select from 'react-select';
import { find, get } from 'lodash';
import {
  Flex,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import { Languages, PropertyTypes } from 'pkg.campaign-components';
import { useFormField, FormWizardField } from 'pkg.form-wizard';
import WorkspaceFieldLabel from '@product/components/Workspace/FieldLabel';
import WorkspaceUploadField from '@product/components/Workspace/UploadField';
import useSiteLanguages from '@product/hooks/useSiteLanguages';

export default function FormField(props) {
  const { setting } = props;

  const settingId = get(setting, 'id');
  const primaryFieldId = `${settingId}-${Languages.US_ENGLISH_LANG}`;
  const { labelProps } = useFormField(primaryFieldId);

  const siteLanguages = useSiteLanguages();

  const isTranslatable = !!get(setting.field, 'isTranslatable', false);
  const languages = isTranslatable ? siteLanguages : [Languages.US_ENGLISH_LANG];

  return (
    <Flex.Column gridGap="8px">
      <WorkspaceFieldLabel
        labelProps={labelProps}
        help={get(setting, 'help')}
        hideRequiredStatus
      />
      {languages.map((language) => (
        <Flex.Column key={language} gridGap="4px">
          <FormWizardField fieldId={`${settingId}-${language}`}>
            {(field) => (
              <React.Fragment>
                {(() => {
                  switch (get(setting, 'type')) {
                    case PropertyTypes.URL_TYPE:
                    case PropertyTypes.SHORT_TEXT_TYPE: return (
                      <Inputs.DefaultText
                        {...field.inputProps}
                        {...field.inputStylingProps}
                        aria-labelledby={primaryFieldId}
                      />
                    );

                    case PropertyTypes.TOGGLE_TYPE: return (
                      <Inputs.Toggle
                        labelledBy={primaryFieldId}
                        value={field.value}
                        setValue={field.setFieldValue}
                      />
                    );

                    case PropertyTypes.SELECT_TYPE: {
                      const options = get(setting, 'options');
                      const selectedValues = (field.value || []).map((value) => find(options, { value }));

                      return (
                        <Select
                          isMulti
                          value={selectedValues}
                          options={options}
                          onChange={(selectedOptions) => (
                            field.setFieldValue(selectedOptions.map(({ value }) => value))
                          )}
                          aria-labelledby={primaryFieldId}
                        />
                      );
                    };

                    case PropertyTypes.UPLOAD_TYPE: {
                      const allow = get(setting, 'allow', []);

                      return (
                        <WorkspaceUploadField
                          allow={allow}
                          imageSource={field.value}
                          setImageSource={(source) => field.setFieldValue(source)}
                        />
                      );
                    }

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
