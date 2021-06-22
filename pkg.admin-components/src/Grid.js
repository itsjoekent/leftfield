import styled, { css } from 'styled-components';

const common = css`
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${({ align }) => !!justify && css`justify-content: ${align};`}
  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap}px;`}

  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}
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
