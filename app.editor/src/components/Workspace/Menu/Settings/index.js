import React from 'react';
import { find, get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { FormWizardProvider, formActions } from 'pkg.form-wizard';
import { Flex } from 'pkg.admin-components';
import { SiteSettings } from 'pkg.campaign-components';
import WorkspaceMenuSettingsFormField from '@editor/components/Workspace/Menu/Settings/FormField';
import useSiteLanguages from '@editor/hooks/useSiteLanguages';
import isDefined from '@editor/utils/isDefined';
import pullTranslatedValue from '@editor/utils/pullTranslatedValue';

export default function Settings(props) {
  const {
    formName,
    setter,
    getter,
  } = props;

  const settingValues = useSelector(getter);
  const dispatch = useDispatch();

  const languages = useSiteLanguages();

  const apiRef = React.useRef(null);

  const settings = Object.keys(SiteSettings)
    .map((settingId) => SiteSettings[settingId]);

  const fields = settings.reduce((acc, setting) => ([
    ...acc,
    ...languages.map((language) => ({
      id: `${setting.key}-${language}`,
      label: setting.field.label,
      attributes: {
        settingId: setting.key,
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
      const settingId = get(field, 'attributes.settingId');
      const language = get(field, 'attributes.language');

      const settingValue = pullTranslatedValue(get(settingValues, settingId), language);

      if (isDefined(settingValue) && formState.values[field.id] !== settingValue) {
        formDispatch(formActions.setValue(
          field.id,
          settingValue,
        ));
      }
    });
  }, [
    settingValues,
    fields,
  ]);

  function onFieldSave(fieldId, value) {
    const field = find(fields, { id: fieldId });
    const settingId = get(field, 'attributes.settingId');
    const language = get(field, 'attributes.language');

    dispatch(setter({
      settingId,
      language,
      value,
    }));
  }

  return (
    <FormWizardProvider
      name={`settings-${formName}`}
      fields={fields}
      apiRef={apiRef}
      onFieldSave={onFieldSave}
    >
      {(formProps) => (
        <Flex.Column as="form" gridGap="24px" {...formProps}>
          {settings.map((setting) => (
            <WorkspaceMenuSettingsFormField
              key={setting.key}
              setting={setting}
            />
          ))}
        </Flex.Column>
      )}
    </FormWizardProvider>
  );
}
