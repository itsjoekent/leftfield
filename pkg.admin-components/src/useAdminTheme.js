import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export default function useAdminTheme() {
  const theme = useContext(ThemeContext);
  return theme || {};
}
