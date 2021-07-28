import React from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import {
  Buttons,
  Flex,
  Grid,
  Typography,
} from 'pkg.admin-components';
import { ADD_CUSTOM_SCREEN } from '@product/components/Modal/Fonts';
import FontStarterKit from '@product/components/Modal/Fonts/StarterKit';

export default function StarterScreen(props) {
  const { setScreen } = props;

  return (
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
      <Grid fullWidth columns="1fr 1fr" gap="24px">
        <FontStarterKit
          name="FiraSans-Merriweather"
          headerFontImport={`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&display=swap" rel="stylesheet">`}
          headerFontName="Fira Sans"
          headerFontFamily="'Fira Sans', sans-serif"
          headerWeights={{
            regular: { label: 'Regular', value: 400 },
            bold: { label: 'Bold', value: 700 },
            black: { label: 'Black', value: 900 },
          }}
          paragraphFontImport={`<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">`}
          paragraphFontName="Merriweather"
          paragraphFontFamily="'Merriweather', serif"
          paragraphWeights={{
            light: { label: 'Light', value: 300 },
            regular: { label: 'Regular', value: 400 },
            bold: { label: 'Bold', value: 700 },
          }}
        />
        <FontStarterKit
          name="Chivo-Overpass"
          headerFontImport={`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&display=swap" rel="stylesheet">`}
          headerFontName="Chivo"
          headerFontFamily="'Chivo', sans-serif"
          headerWeights={{
            regular: { label: 'Regular', value: 400 },
            bold: { label: 'Bold', value: 700 },
            black: { label: 'Black', value: 900 },
          }}
          paragraphFontImport={`<link href="https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,300;0,400;0,700;1,400&display=swap" rel="stylesheet">`}
          paragraphFontName="Overpass"
          paragraphFontFamily="'Overpass', sans-serif"
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
        onClick={() => setScreen(ADD_CUSTOM_SCREEN)}
      >
        <Typography fontStyle="medium" fontSize="14px">
          Add a custom font
        </Typography>
      </Buttons.Text>
    </Flex.Column>
  );
}
