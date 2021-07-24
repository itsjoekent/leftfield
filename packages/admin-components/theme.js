import { css } from 'styled-components';

const theme = {
  animation: {
    defaultTransition: '0.4s',
  },
  colors: {
    mono: {
      '900': '#151516',
      '800': '#212123',
      '700': "#323234",
      '600': "#454548",
      '500': '#75757a',
      '400': '#C5C5C7',
      '300': '#E3E3E4',
      '200': '#F7F7F7',
      '100': "#FFFFFF",
    },
    blue: {
      '800': '#004F9D',
      '700': '#005FBC',
      '600': '#006DDA',
      '500': '#0080ff',
      '400': '#3399ff',
      '300': '#62B1FF',
      '200': '#9DCEFF',
      '100': '#EBF5FF',
    },
    purple: {
      '800': '#4B0095',
      '700': '#5D00BA',
      '600': '#6F00DE',
      '500': '#8000FF',
      '400': '#9428FF',
      '300': '#AF5FFF',
      '200': '#D2A5FF',
      '100': '#F2E4FF',
    },
    red: {
      '800': '#A40000',
      '700': '#D70000',
      '600': '#EC0000',
      '500': '#ff0000',
      '400': '#FF2626',
      '300': '#FF4A4A',
      '200': '#FF9393',
      '100': '#FFC2C2',
    },
    yellow: {
      '800': '#A0A000',
      '700': '#dada00',
      '600': '#EEEE00',
      '500': '#FFFF06',
      '400': '#FFFF21',
      '300': '#FFFF57',
      '200': '#FFFF9B',
      '100': '#FFFFD9',
    },
  },
  fonts: {
    main: {
      'thin': css`
        font-family: frank-new,sans-serif;
        font-weight: 200;
        font-style: normal;
      `,
      'light': css`
        font-family: frank-new,sans-serif;
        font-weight: 300;
        font-style: normal;
      `,
      'regular': css`
        font-family: frank-new,sans-serif;
        font-weight: 400;
        font-style: normal;
      `,
      'regularItalic': css`
        font-family: frank-new,sans-serif;
        font-weight: 400;
        font-style: italic;
      `,
      'medium': css`
        font-family: frank-new,sans-serif;
        font-weight: 500;
        font-style: normal;
      `,
      'bold': css`
        font-family: frank-new,sans-serif;
        font-weight: 700;
        font-style: normal;
      `,
      'boldItalic': css`
        font-family: frank-new,sans-serif;
        font-weight: 700;
        font-style: italic;
      `,
      'extraBold': css`
        font-family: frank-new,sans-serif;
        font-weight: 800;
        font-style: normal;
      `,
    },
  },
  rounded: {
    default: '2px',
    extra: '4px',
  },
  shadow: {
    light: 'box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);',
  },
  zIndex: {
    modal: 100,
    snacks: 200,
    tooltip: 1000000,
  },
};

export default theme;
