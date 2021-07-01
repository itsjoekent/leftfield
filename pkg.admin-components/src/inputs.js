import styled, { css } from 'styled-components';
import generics from '@ac/generics';

export const Text = styled.input`
  ${generics}
`;

export const DefaultText = styled(Text)`
  width: 100%;
  padding: 6px;
  border: 1px solid ${(props) => (props.isFocused
    ? props.theme.colors.mono[700]
    : (
      props.hasError
        ? props.theme.colors.red[500]
        : props.theme.colors.mono[300]
    ))};
  border-radius: ${(props) => props.theme.rounded.default};
  background-color: ${(props) => props.theme.colors.mono[100]};
  font-family: ${(props) => props.theme.fonts.main.regular};
  font-size: 16px;
  color: ${(props) => props.isFocused ? props.theme.colors.mono[900] : props.theme.colors.mono[600]};

  ${generics}
`;
