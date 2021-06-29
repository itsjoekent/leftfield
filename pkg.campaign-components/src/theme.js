const theme = {
  // These are defaults that are replaced at runtime
  campaign: {
    fonts: {
      main: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    },
    fontWeights: {
      light: 200,
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
