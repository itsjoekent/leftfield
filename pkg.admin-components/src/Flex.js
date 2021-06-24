import styled, { css } from 'styled-components';

const common = css`
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${({ align }) => !!align && css`align-items: ${align};`}
  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}

  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}

  ${({ overflowX }) => !!overflowX && css`overflow-x: ${overflowX}`};
  ${({ overflowY }) => !!overflowY && css`overflow-y: ${overflowY}`};

  ${({ flexGrow }) => !!flexGrow && css`flex-grow: 1;`}

  ${({ padding }) => !!padding && css`padding: ${padding};`}
  ${({ paddingVertical }) => !!paddingVertical && css`
    padding-top: ${paddingVertical};
    padding-bottom: ${paddingVertical};
  `}
  ${({ paddingHorizontal }) => !!paddingHorizontal && css`
    padding-left: ${paddingHorizontal};
    padding-right: ${paddingHorizontal};
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
