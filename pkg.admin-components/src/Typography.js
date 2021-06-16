import styled from 'styled-components';

export const Title = styled.h1`
  ${(props) => props.theme.fonts.main.extraBold};
  font-size: 48px;
  line-height: 1.1;
`;

export const LargeMenuTitle = styled.p`
  ${(props) => props.theme.fonts.main.bold};
  font-size: 18px;
  letter-spacing: 2%;
`;
