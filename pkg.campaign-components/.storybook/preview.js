import { ThemeProvider } from 'styled-components';
import theme from '../src/theme';

const campaignTheme = {
  // ...
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={{ ...theme, campaign: campaignTheme }}>
      <Story />
    </ThemeProvider>
  ),
];
