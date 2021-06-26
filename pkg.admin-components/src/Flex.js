import styled, { css } from 'styled-components';
import generics from './generics';

const common = css`
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${({ align }) => !!align && css`align-items: ${align};`}
  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}

  ${generics}
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  ${common}
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  ${common}
`;
