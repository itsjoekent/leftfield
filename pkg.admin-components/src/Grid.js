import styled, { css } from 'styled-components';

const Grid = styled.div`
  display: grid;

  ${({ columns }) => !!columns && css`grid-template-columns: ${columns};`}
  ${({ rows }) => !!rows && css`grid-template-rows: ${rows};`}

  ${({ gap }) => !!gap && css`grid-gap: ${gap};`}
  ${({ rowGap }) => !!rowGap && css`grid-row-gap: ${rowGap};`}
  ${({ columnGap }) => !!columnGap && css`grid-column-gap: ${columnGap};`}

  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}

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

export default Grid;
