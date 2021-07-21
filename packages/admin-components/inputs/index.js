import styled, { css } from 'styled-components';
import generics from 'pkg.admin-components/generics';

export const Text = styled.input`
  ${generics}
`;

export const DefaultText = styled(Text)`
  width: 100%;
  padding: 6px;
  border: 1px solid ${(props) => (props.isFocused ? props.theme.colors.mono[700] : props.theme.colors.mono[300])};
  border-radius: ${(props) => props.theme.rounded.default};
  background-color: ${(props) => props.theme.colors.mono[100]};
  font-family: ${(props) => props.theme.fonts.main.regular};
  font-size: 16px;
  color: ${(props) => props.isFocused ? props.theme.colors.mono[900] : props.theme.colors.mono[600]};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: color, background-color, border;

  ${generics}

  &:disabled {
    cursor: not-allowed;
    border: 1px solid ${(props) => props.theme.colors.mono[300]};
    background-color: ${(props) => props.theme.colors.mono[200]};
    color: ${(props) => props.theme.colors.mono[600]};
  }

  ${(props) => props.hasError && css`
    border: 1px solid ${(props) => props.theme.colors.red[500]};
    color: ${(props) => props.theme.colors.red[500]};
  `}
`;

export { default as Checklist } from 'pkg.admin-components/inputs/Checklist';
export { default as Toggle } from 'pkg.admin-components/inputs/Toggle';
