import styled, { css } from 'styled-components';

const common = css`
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${({ align }) => !!align && css`justify-content: ${align};`}
  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap}px;`}

  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}

  ${({ overflowY }) => !!overflowY && css`overflow-y: ${overflowY}`};

  ${({ flexGrow }) => !!flexGrow && css`flex-grow: 1;`}

  ${({ padding }) => !!padding && css`padding: ${padding}px;`}
  ${({ paddingVertical }) => !!paddingVertical && css`
    padding-top: ${paddingVertical}px;
    padding-bottom: ${paddingVertical}px;
  `}
  ${({ paddingHorizontal }) => !!paddingHorizontal && css`
    padding-left: ${paddingHorizontal}px;
    padding-right: ${paddingHorizontal}px;
  `}
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
