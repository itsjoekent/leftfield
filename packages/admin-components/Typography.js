import styled, { css } from 'styled-components';
import {
  animation,
  colors,
  cursor,
  overflow,
  padding,
  size,
} from 'pkg.admin-components/generics';

const Typography = styled.p`
  ${(props) => props.fontStyle && props.theme.fonts[props.fontFamily || 'main'][props.fontStyle]}
  ${(props) => props.fontSize && css`font-size: ${props.fontSize};`}
  ${(props) => props.letterSpacing && css`letter-spacing: ${props.letterSpacing};`}
  ${(props) => props.lineHeight && css`line-height: ${props.lineHeight};`}

  ${(props) => props.textAlign && css`text-align: ${props.textAlign};`}
  ${(props) => props.textDecoration && css`text-decoration: ${props.textDecoration};`}
  ${(props) => props.textOverflow && css`text-overflow: ${props.textOverflow};`}
  ${(props) => props.whiteSpace && css`white-space: ${props.whiteSpace};`}

  ${animation}
  ${colors}
  ${cursor}
  ${overflow}
  ${padding}
  ${size}
`;

export default Typography;
