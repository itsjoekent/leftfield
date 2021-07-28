import React from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Grid,
  Typography,
} from 'pkg.admin-components';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import FontStarterKit from '@product/components/Modal/Fonts/StarterKit';
import {
  selectCampaignThemeFont,
} from '@product/features/assembly';

const STARTER_SCREEN = 'STARTER_SCREEN';
const ADD_CUSTOM_SCREEN = 'ADD_CUSTOM_SCREEN';
const EDIT_SCREEN = 'EDIT_SCREEN';

export default function Fonts(props) {
  const {
    fontId,
  } = props;

  const dispatch = useDispatch();
  const font = useSelector(selectCampaignThemeFont(fontId));

  const [screen, setScreen] = React.useState(!!get(font, 'value') ? EDIT_SCREEN : STARTER_SCREEN);

  return (
    <ModalDefaultLayout title="Manage font" width="800px">
      {screen === STARTER_SCREEN && (
        <Flex.Column
          align="center"
          gridGap="24px"
          fullWidth
          maxHeight="80vh"
          bg={(colors) => colors.mono[100]}
          padding="24px"
          overflowY="scroll"
        >
          <Flex.Column gridGap="4px">
            <Typography
              as="h2"
              fontStyle="bold"
              fontSize="22px"
              fg={(colors) => colors.mono[700]}
              textAlign="center"
            >
              Select a starter font
            </Typography>
            <Typography fontStyle="regular" fontSize="14px" textAlign="center">
              These are pre-configured font pairings for use in Leftfield, hosted by Google Fonts, and are free to use.
            </Typography>
          </Flex.Column>
          <Grid fullWidth columns="1fr 1fr" gridGap="6px">
            <FontStarterKit
              name="Merriweather-SourceSansPro"
              headerFontImport={`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap" rel="stylesheet">`}
              headerFontName="Merriweather"
              headerFontFamily="'Merriweather', serif"
              headerWeights={{
                regular: { label: 'Regular', value: 400 },
                bold: { label: 'Bold', value: 700 },
                black: { label: 'Black', value: 900 },
              }}
              paragraphFontImport={`<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;700&display=swap" rel="stylesheet">`}
              paragraphFontName="Source Sans Pro"
              paragraphFontFamily="'Source Sans Pro', sans-serif"
              paragraphWeights={{
                light: { label: 'Light', value: 300 },
                regular: { label: 'Regular', value: 400 },
                bold: { label: 'Bold', value: 700 },
              }}
            />
          </Grid>
          <Buttons.Text
            buttonFg={(colors) => colors.blue[500]}
            hoverButtonFg={(colors) => colors.blue[800]}
            onClick={() => setScreen(CUSTOM_SCREEN)}
          >
            <Typography fontStyle="medium" fontSize="14px">
              Add a custom font
            </Typography>
          </Buttons.Text>
        </Flex.Column>
      )}
    </ModalDefaultLayout>
  );
}
