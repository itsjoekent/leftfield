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
import {
  selectCampaignThemeFontWeights,
  setCampaignThemeKeyValue,
  setMetaValue,
} from '@product/features/assembly';
import { setModal } from '@product/features/modal';

function FontWeightInput(props) {
  const {
    inputLabel,
    label,
    weight,
    fontWeightId,
    fontWeights,
    setFontWeights,
  } = props;

  const isChecked = !!get(fontWeights, `${fontWeightId}.value`, null);

  function onChange() {
    if (isChecked) {
      setFontWeights((state) => {
        const copy = { ...state };
        delete copy[fontWeightId];

        return copy;
      });
    } else {
      setFontWeights((state) => {
        const copy = { ...state };
        copy[fontWeightId] = {
          label,
          value: weight,
        };

        return copy;
      });
    }
  }

  return (
    <Flex.Row gridGap="2px" paddingVertical="2px" onClick={onChange}>
      <input
        type="checkbox"
        aria-label={label}
        checked={isChecked}
        onChange={onChange}
      />
      <Typography
        as="label"
        fontStyle="regular"
        fontSize="14px"
        fg={(colors) => colors.mono[700]}
      >
        {inputLabel}
      </Typography>
    </Flex.Row>
  );
}

const fields = [
  { id: 'fontLabel', label: 'Font Label' },
  { id: 'fontFamily', label: 'Font Family' },
  { id: 'fontHtml', label: 'Embed Code' },
  { id: 'fontWeights', label: 'Font Weights' },
];

export default function ManualScreen(props) {
  const { font } = props;
  const fontId = get(font, 'id');

  const dispatch = useDispatch();
  const themeFontWeights = useSelector(selectCampaignThemeFontWeights(fontId));

  const [fontWeights, setFontWeights] = React.useState(themeFontWeights);

  const formApiRef = React.useRef(null);

  React.useEffect(() => {
    setFontWeights(themeFontWeights);

    if (formApiRef.current) {
      formApiRef.current.dispatch(formActions.setValue('fontLabel', get(font, 'label', '')));
      formApiRef.current.dispatch(formActions.setValue('fontFamily', get(font, 'value', '')));
      formApiRef.current.dispatch(formActions.setValue('fontHtml', get(font, 'html', '')));
    }
  }, [fontId, Object.keys(themeFontWeights || {}).length]);

  function onSave({ values }) {
    const saveTo = fontId || uuid();

    batch(() => {
      dispatch(setCampaignThemeKeyValue({
        path: `fonts.${saveTo}`,
        value: {
          label: values.fontLabel,
          value: values.fontFamily,
          html: values.fontHtml,
        },
      }));

      dispatch(setCampaignThemeKeyValue({
        path: `fontWeights.${saveTo}`,
        value: fontWeights,
      }));

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
            <FormWizardField fieldId="fontWeights">
              {(field) => (
                <Flex.Column gridGap="6px">
                  <Flex.Column gridGap="2px">
                    <Typography
                      as="label"
                      fontStyle="bold"
                      fontSize="14px"
                      letterSpacing="2%"
                      fg={(colors) => colors.mono[700]}
                      {...field.labelProps}
                    />
                    <Typography
                      fontStyle="regular"
                      fontSize="12px"
                      fg={(colors) => colors.mono[700]}
                    >
                      Make sure to only pick the font weights you selected in your font host
                    </Typography>
                  </Flex.Column>
                  <Grid fullWidth columns="1fr 1fr 1fr" gap="12px">
                    <FontWeightInput
                      inputLabel="Thin (100)"
                      label="Thin"
                      weight={100}
                      fontWeightId="thin"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Extra Light (200)"
                      label="Extra Light"
                      weight={200}
                      fontWeightId="extraLight"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Light (300)"
                      label="Light"
                      weight={300}
                      fontWeightId="light"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Normal (400)"
                      label="Normal"
                      weight={400}
                      fontWeightId="normal"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Medium (500)"
                      label="Medium"
                      weight={500}
                      fontWeightId="medium"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Semi Bold (600)"
                      label="Semi Bold"
                      weight={600}
                      fontWeightId="semiBold"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Bold (700)"
                      label="Bold"
                      weight={700}
                      fontWeightId="bold"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Extra Bold (800)"
                      weight={800}
                      fontWeightId="extraBold"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                    <FontWeightInput
                      inputLabel="Black (900)"
                      label="Black"
                      weight={900}
                      fontWeightId="black"
                      fontWeights={fontWeights}
                      setFontWeights={setFontWeights}
                    />
                  </Grid>
                </Flex.Column>
              )}
            </FormWizardField>
            <Buttons.Filled
              type="submit"
              paddingVertical="4px"
              paddingHorizontal="8px"
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.blue[500]}
              hoverButtonBg={(colors) => colors.blue[700]}
            >
              <Typography fontStyle="medium" fontSize="16px">
                {!!fontId ? 'Save font' : 'Add font'}
              </Typography>
            </Buttons.Filled>
          </Flex.Column>
        )}
      </FormWizardProvider>
    </Flex.Column>
  );
}
