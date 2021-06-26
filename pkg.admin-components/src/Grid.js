import styled, { css } from 'styled-components';
import generics from './generics';

const Grid = styled.div`
  display: grid;

  ${({ columns }) => !!columns && css`grid-template-columns: ${columns};`}
  ${({ rows }) => !!rows && css`grid-template-rows: ${rows};`}

  ${({ gap }) => !!gap && css`grid-gap: ${gap};`}
  ${({ rowGap }) => !!rowGap && css`grid-row-gap: ${rowGap};`}
  ${({ columnGap }) => !!columnGap && css`grid-column-gap: ${columnGap};`}

  ${generics}
`;

export default Grid;
