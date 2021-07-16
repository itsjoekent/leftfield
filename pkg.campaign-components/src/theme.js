export const DEFAULT_FONT_FAMILY = 'main';

const theme = {
  // These are defaults that are updated at runtime
  campaign: {
    colors: {
      'blue': {
        label: 'Blue',
        type: 'solid',
        value: '#1e90ff',
      },
      'red': {
        label: 'Red',
        type: 'solid',
        value: '#ff1e20',
      },
      'black': {
        label: 'Black',
        type: 'solid',
        value: '#00050a',
      },
      'white': {
        label: 'White',
        type: 'solid',
        value: '#ffffff',
      },
    },
    fonts: {
      [DEFAULT_FONT_FAMILY]: {
        label: 'Helvetica',
        value: 'Helvetica Neue, Helvetica, Arial, sans-serif',
      },
    },
    fontWeights: {
      [DEFAULT_FONT_FAMILY]: {
        light: {
          label: 'Light',
          value: 200,
        },
        normal: {
          label: 'Normal',
          value: 400,
        },
        medium: {
          label: 'Medium',
          value: 600,
        },
        bold: {
          label: 'Bold',
          value: 700,
        },
        extraBold: {
          label: 'Extra Bold',
          value: 900,
        },
      },
    },
    meta: {
      colorSortOrder: [
        'blue',
        'red',
        'black',
        'white',
      ],
    },
  },

  deviceBreakpoints: {
    mobileSmall: '320px',
    mobileSmallUp: 'min-width: 320px',
    mobileMedium: '375px',
    mobileMediumUp: 'min-width: 375px',
    mobileLarge: '410px',
    mobileLargeUp: 'min-width: 410px',
    tablet: '768px',
    tabletUp: 'min-width: 768px',
    desktopSmall: '1024px',
    desktopSmallUp: 'min-width: 1024px',
    desktopMedium: '1440px',
    desktopMediumUp: 'min-width: 1440px',
    desktopLarge: '2560px',
    desktopLargeUp: 'min-width: 2560px',
  },
  fontSizes: {
    legal: {
      small: '10px',
      normal: '12px',
    },
  },

  // Provided within some components
  properties: null,
  slots: null,
};

export default theme;
