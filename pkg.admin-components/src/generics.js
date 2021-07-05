import { css } from 'styled-components';

export const border = css`
  ${({ rounded, theme }) => !!rounded && css`border-radius: ${rounded(theme.rounded)};`}
  ${({ borderWidth, borderColor, theme }) => !!borderWidth && !!borderColor && css`border: ${borderWidth} solid ${borderColor(theme.colors)};`}
`;

export const colors = css`
  ${({ fg, theme }) => !!fg && css`color: ${fg(theme.colors)};`}
  ${({ bg, theme }) => !!bg && css`background-color: ${bg(theme.colors)};`}
  ${({ hoverFg, theme }) => !!hoverFg && css`
    &:hover {
      color: ${hoverFg(theme.colors)};
    }`
  }
  ${({ hoverBg, theme }) => !!hoverBg && css`
    &:hover {
      background-color: ${hoverBg(theme.colors)};
    }
  `}
`;

export const cursor = css`
  ${({ cursor }) => !!cursor && css`cursor: ${cursor};`}
`;

export const margin = css`
  ${({ margin }) => !!margin && css`margin: ${margin};`}
  ${({ marginVertical }) => !!marginVertical && css`
    margin-top: ${marginVertical};
    margin-bottom: ${marginVertical};
  `}
  ${({ marginHorizontal }) => !!marginHorizontal && css`
    margin-left: ${marginHorizontal};
    margin-right: ${marginHorizontal};
  `}
  ${({ marginTop }) => !!marginTop && css`
    margin-top: ${marginTop};
  `}
  ${({ marginBottom }) => !!marginBottom && css`
    margin-bottom: ${marginBottom};
  `}
  ${({ marginLeft }) => !!marginLeft && css`
    margin-left: ${marginLeft};
  `}
  ${({ marginRight }) => !!marginRight && css`
    margin-right: ${marginRight};
  `}
`;

export const overflow = css`
  ${({ overflow }) => !!overflow && css`overflow: ${overflow};`}
  ${({ overflowX }) => !!overflowX && css`overflow-x: ${overflowX};`}
  ${({ overflowY }) => !!overflowY && css`overflow-y: ${overflowY};`}
`;

export const padding = css`
  ${({ padding }) => !!padding && css`padding: ${padding};`}
  ${({ paddingVertical }) => !!paddingVertical && css`
    padding-top: ${paddingVertical};
    padding-bottom: ${paddingVertical};
  `}
  ${({ paddingHorizontal }) => !!paddingHorizontal && css`
    padding-left: ${paddingHorizontal};
    padding-right: ${paddingHorizontal};
  `}
  ${({ paddingTop }) => !!paddingTop && css`
    padding-top: ${paddingTop};
  `}
  ${({ paddingBottom }) => !!paddingBottom && css`
    padding-bottom: ${paddingBottom};
  `}
  ${({ paddingLeft }) => !!paddingLeft && css`
    padding-left: ${paddingLeft};
  `}
  ${({ paddingRight }) => !!paddingRight && css`
    padding-right: ${paddingRight};
  `}
`;

export const position = css`
  ${({ position }) => !!position && css`position: ${position};`}
`;

export const shadow = css`
  ${({ shadow, theme }) => !!shadow && shadow(theme.shadow)}
`;

export const size = css`
  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}

  ${({ flexGrow }) => !!flexGrow && css`flex-grow: 1;`}

  ${({ fitHeight }) => !!fitHeight && css`height: fit-content;`}
  ${({ fitWidth }) => !!fitWidth && css`width: fit-content;`}

  ${({ minWidth }) => !!minWidth && css`min-width: ${minWidth};`}
  ${({ minHeight }) => !!minHeight && css`min-height: ${minHeight};`}
`;

const all = css`
  ${border}
  ${colors}
  ${cursor}
  ${margin}
  ${overflow}
  ${padding}
  ${position}
  ${shadow}
  ${size}
`;

export default all;
