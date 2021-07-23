import { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const animation = css`
  ${({ theme, transitions }) => !!transitions && css`
    transition: all ${theme.animation.defaultTransition};
    transition-property: ${transitions.join(', ')};
  `}

  ${({ playFadeIn, theme }) => !!playFadeIn && css`
    animation: ${theme.animation.defaultTransition} ${fadeIn} ease-in forwards;
  `}

  ${({ playFadeOut, theme }) => !!playFadeOut && css`
    animation: ${theme.animation.defaultTransition} ${fadeOut} ease-out forwards;
  `}
`;

export const border = css`
  ${({ rounded, theme }) => !!rounded && css`border-radius: ${rounded(theme.rounded)};`}
  ${({ borderWidth, borderColor, theme }) => !!borderWidth && !!borderColor && css`border: ${borderWidth} solid ${borderColor(theme.colors)};`}
  ${({ hoverBorderColor, theme }) => !!hoverBorderColor && css`
    &:hover {
      border-color: ${hoverBorderColor(theme.colors)};
    }
  `}
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
  ${({ zIndex, theme }) => !!zIndex && css`z-index: ${zIndex(theme.zIndex)};`}
  ${({ top }) => !!top && css`top: ${top};`}
  ${({ bottom }) => !!bottom && css`bottom: ${bottom};`}
  ${({ left }) => !!left && css`left: ${left};`}
  ${({ right }) => !!right && css`right: ${right};`}
  ${({ transform }) => !!transform && css`transform: ${transform};`}
`;

export const shadow = css`
  ${({ shadow, theme }) => !!shadow && shadow(theme.shadow)}
  ${({ hoverShadow, theme }) => !!hoverShadow && css`
    &:hover {
      shadow: ${hoverShadow(theme.shadow)};
    }
  `}
`;

export const size = css`
  ${({ fullHeight }) => !!fullHeight && css`height: 100%;`}
  ${({ fullWidth }) => !!fullWidth && css`width: 100%;`}
  ${({ fullViewportHeight }) => !!fullViewportHeight && css`height: 100vh;`}

  ${({ flexGrow }) => !!flexGrow && css`flex-grow: 1;`}

  ${({ fitHeight }) => !!fitHeight && css`height: fit-content;`}
  ${({ fitWidth }) => !!fitWidth && css`width: fit-content;`}

  ${({ specificWidth }) => !!specificWidth && css`width: ${specificWidth};`}
  ${({ specificHeight }) => !!specificHeight && css`height: ${specificHeight};`}

  ${({ minWidth }) => !!minWidth && css`min-width: ${minWidth};`}
  ${({ minHeight }) => !!minHeight && css`min-height: ${minHeight};`}

  ${({ maxWidth }) => !!maxWidth && css`max-width: ${maxWidth};`}
  ${({ maxHeight }) => !!maxHeight && css`max-height: ${maxHeight};`}
`;

const all = css`
  ${animation}
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
