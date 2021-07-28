import React from 'react';
import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Grid,
  Inputs,
  Typography,
} from 'pkg.admin-components';
import {
  FormWizardProvider,
  FormWizardField,
  formActions,
} from 'pkg.form-wizard';
import { setCampaignThemeKeyValue } from '@product/features/assembly';
import { setModal } from '@product/features/modal';

const fields = [
  { id: 'fontLabel', label: 'Font Label' },
  { id: 'fontFamily', label: 'Font Family' },
  { id: 'fontHtml', label: 'Embed Code' },
];

export default function ManualScreen(props) {
  const { font } = props;
  const fontId = get(font, 'id');

  const dispatch = useDispatch();

  const [fontLabel, setFontLabel] = React.useState(get(font, 'label', ''));
  const [fontFamily, setFontFamily] = React.useState(get(font, 'value', ''));
  const [fontHtml, setFontHtml] = React.useState(get(font, 'html', ''));

  const formApiRef = React.useRef(null);

  React.useEffect(() => {
    const label = get(font, 'label', '');
    setFontLabel(label);

    const value = get(font, 'value', '');
    setFontFamily(value);

    const html = get(font, 'html', '');
    setFontHtml(html);

    if (formApiRef.current) {
      formApiRef.current.dispatch(formActions.setValue('fontLabel', label));
      formApiRef.current.dispatch(formActions.setValue('fontFamily', value));
      formApiRef.current.dispatch(formActions.setValue('fontHtml', html));
    }
  }, [fontId]);

  function onSave() {
    const saveTo = fontId || uuid();

    batch(() => {
      dispatch(setCampaignThemeKeyValue({
        path: `fonts.${saveTo}`,
        value: {
          label: fontLabel,
          value: fontFamily,
          html: fontHtml,
        },
      }));

      // dispatch(setCampaignThemeKeyValue({
      //   path: `fontWeights.${saveTo}`,
      //   value: headerWeights,
      // }));

      if (!fontId) {
        dispatch(setMetaValue({
          item: saveTo,
          op: '$PUSH',
          path: 'fontSortOrder',
        }));
      }

      dispatch(setModal({ type: null }));
    });
  }

  return (
    <Flex.Column
      fullWidth
      gridGap="24px"
      padding="24px"
      bg={(colors) => colors.mono[100]}
    >
      <Flex.Column gridGap="6px">
        <Typography
          as="h2"
          fontStyle="bold"
          fontSize="22px"
          fg={(colors) => colors.mono[700]}
        >
          {!!fontId ? 'Edit font configuration' : 'Add a new font'}
        </Typography>
        <Typography>
          Add custom fonts from Google Fonts, Adobe Typekit, Fonts.com, and more.
        </Typography>
      </Flex.Column>
      <FormWizardProvider
        name="font"
        fields={fields}
        onFormSubmit={onSave}
        apiRef={formApiRef}
      >
        {({ formProps }) => (
          <Flex.Column as="form" gridGap="24px" {...formProps}>
            <Grid fullWidth columns="1fr 1fr" gap="24px">
              <FormWizardField fieldId="fontLabel">
                {(field) => (
                  <Flex.Column gridGap="2px">
                    <Typography
                      as="label"
                      fontStyle="bold"
                      fontSize="14px"
                      letterSpacing="2%"
                      fg={(colors) => colors.mono[700]}
                      {...field.labelProps}
                    />
                    <Inputs.DefaultText
                      {...field.inputProps}
                      {...field.inputStylingProps}
                    />
                  </Flex.Column>
                )}
              </FormWizardField>
              <FormWizardField fieldId="fontFamily">
                {(field) => (
                  <Flex.Column gridGap="2px">
                    <Typography
                      as="label"
                      fontStyle="bold"
                      fontSize="14px"
                      letterSpacing="2%"
                      fg={(colors) => colors.mono[700]}
                      {...field.labelProps}
                    />
                    <Inputs.DefaultText
                      {...field.inputProps}
                      {...field.inputStylingProps}
                    />
                    <Typography
                      fontStyle="regular"
                      fontSize="12px"
                      fg={(colors) => colors.mono[700]}
                    >
                      Your font host should provide this, it should look something like the following, <Typography as="span" fg={(colors) => colors.blue[400]}>'Overpass', sans-serif</Typography>
                    </Typography>
                  </Flex.Column>
                )}
              </FormWizardField>
            </Grid>
            <FormWizardField fieldId="fontHtml">
              {(field) => (
                <Flex.Column gridGap="2px">
                  <Typography
                    as="label"
                    fontStyle="bold"
                    fontSize="14px"
                    letterSpacing="2%"
                    fg={(colors) => colors.mono[700]}
                    {...field.labelProps}
                  />
                  <Inputs.DefaultText
                    {...field.inputProps}
                    {...field.inputStylingProps}
                  />
                  <Typography
                    fontStyle="regular"
                    fontSize="12px"
                    fg={(colors) => colors.mono[700]}
                  >
                    This is custom HTML provided by your font host, for example,
                  </Typography>
                  <Typography
                    as="span"
                    fontStyle="regular"
                    fontSize="12px"
                    fg={(colors) => colors.blue[400]}
                  >{`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass&display=swap">`}</Typography>
                  <Typography
                    as="span"
                    fontStyle="regular"
                    fontSize="12px"
                    fg={(colors) => colors.blue[400]}
                  >{`<link rel="stylesheet" href="https://use.typekit.net/alh6vmn.css">`}</Typography>
                </Flex.Column>
              )}
            </FormWizardField>
          </Flex.Column>
        )}
      </FormWizardProvider>
    </Flex.Column>
  );
}
