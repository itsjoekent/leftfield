import styled, { css } from 'styled-components';
import generics from 'pkg.admin-components/generics';

const common = css`
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${({ align }) => !!align && css`align-items: ${align};`}
  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}
  ${({ wrap }) => !!wrap && css`flex-wrap: ${wrap};`}

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
