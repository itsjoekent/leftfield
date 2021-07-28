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
        label: 'Roboto',
        value: `'Roboto', sans-serif;`,
        html: `<style>@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');</style>`,
      },
    },
    fontWeights: {
      [DEFAULT_FONT_FAMILY]: {
        light: {
          label: 'Light',
          value: 300,
        },
        normal: {
          label: 'Normal',
          value: 400,
        },
        bold: {
          label: 'Bold',
          value: 700,
        },
        black: {
          label: 'Black',
          value: 900,
        },
      },
    },
  },

  deviceBreakpoints: {
    mobileSmall: '320px',
    mobileSmallUp: 'min-width: 320px',
    mobileMedium: '375px',
    mobileMediumUp: 'min-width: 375px',
    mobileLarge: '410px',
    mobileLargeUp: 'min-width: 410px',
    tablet: '720px',
    tabletUp: 'min-width: 720px',
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
  zIndexes: {
    overlay: 100,
  },
};

export default theme;
