import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { rgba } from 'polished';
import Typography from 'pkg.admin-components/Typography';
import Loading from 'pkg.admin-components/icons/loading';
import generics from 'pkg.admin-components/generics';
import useAdminTheme from 'pkg.admin-components/useAdminTheme';
import useIsHovering from 'pkg.admin-components/useIsHovering';

const spinKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const sharedButtonStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: fit-content;
  white-space: nowrap;
  border-style: solid;
  cursor: pointer;

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: border, background-color, box-shadow;

  ${Typography} {
    transition: color ${(props) => props.theme.animation.defaultTransition};
  }

  svg * {
    transition: all ${(props) => props.theme.animation.defaultTransition};
    transition-property: stroke, fill;

    ${(props) => props.isLoading && css`
      transform-origin: center;
      animation: 1.5s linear infinite ${spinKeyframes};
    `}
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    cursor: pointer;
  }

  ${(props) => props.isLoading && css`
    cursor: not-allowed;
    ${!props.gridGap && css`grid-gap: 2px;`}
  `}

  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}
  ${({ justify }) => !!justify && css`justify-content: ${justify};`}
  ${generics}
`;

const FilledButtonWrapper = styled.button`
  border-radius: ${(props) => props.theme.rounded.extra};

  ${({ buttonBg, isLoading, theme }) => !!buttonBg && css`
    border-color: ${buttonBg(theme.colors)};
    background-color: ${buttonBg(theme.colors)};

    ${isLoading && css`
      border-color: ${rgba(buttonBg(theme.colors), 0.5)};
      background-color: ${rgba(buttonBg(theme.colors), 0.5)};
    `}
  `}

  ${Typography} {
    ${({ buttonFg, theme }) => !!buttonFg && css`color: ${buttonFg(theme.colors)};`}
  }

  &:hover:not(:disabled) {
    ${({ hoverButtonBg, isLoading, theme }) => !!hoverButtonBg && !isLoading && css`
      border-color: ${hoverButtonBg(theme.colors)};
      background-color: ${hoverButtonBg(theme.colors)};
    `}
  }

  ${sharedButtonStyles}
`;

export function Filled(props) {
  const {
    children,
    IconComponent,
    iconSize,
    isLoading,
    ...rest
  } = props;

  const theme = useAdminTheme();

  const buttonRef = React.useRef(null);
  const isHovering = useIsHovering(buttonRef);

  const finalIconColor = !!IconComponent && rest.buttonFg(theme.colors);
  const FinalIconComponent = isLoading ? Loading : IconComponent;

  return (
    <FilledButtonWrapper ref={buttonRef} isLoading={isLoading} {...rest}>
      {!!IconComponent && (
        <FinalIconComponent
          width={iconSize}
          height={iconSize}
          color={finalIconColor}
        />
      )}
      {children}
    </FilledButtonWrapper>
  );
}

const OutlineButtonWrapper = styled.button`
  border-radius: ${(props) => props.theme.rounded.extra};

  ${Typography} {
    ${({ borderColor, theme }) => !!borderColor && css`color: ${borderColor(theme.colors)};`}
  }

  ${({ hoverBorderColor, theme }) => !!hoverBorderColor && css`
    &:hover ${Typography} {
      color: ${hoverBorderColor(theme.colors)};
    }
  `}

  ${sharedButtonStyles}
`;

export function Outline(props) {
  const {
    children,
    IconComponent,
    iconSize,
    ...rest
  } = props;

  const theme = useAdminTheme();

  const buttonRef = React.useRef(null);
  const isHovering = useIsHovering(buttonRef);

  const iconColor = rest.borderColor;
  const iconHoverColor = rest.hoverBorderColor;

  const finalIconColor = !!IconComponent && isHovering
    ? (!!iconHoverColor && iconHoverColor(theme.colors))
    : (!!iconColor && iconColor(theme.colors));

  return (
    <OutlineButtonWrapper ref={buttonRef} {...rest}>
      {!!IconComponent && (
        <IconComponent
          width={iconSize}
          height={iconSize}
          color={finalIconColor}
        />
      )}
      {children}
    </OutlineButtonWrapper>
  );
}

const TextButtonWrapper = styled.button`
  text-decoration: none;

  ${Typography} {
    text-decoration: none;
    ${({ buttonFg, theme }) => !!buttonFg && css`color: ${buttonFg(theme.colors)};`}
  }

  &:hover {
    ${Typography} {
      ${({ hoverButtonFg, theme }) => !!hoverButtonFg && css`color: ${hoverButtonFg(theme.colors)};`}
    }
  }

  svg * {
    transition: all ${(props) => props.theme.animation.defaultTransition};
    transition-property: stroke, fill;
  }

  ${sharedButtonStyles}
  background: none;
  border: none;
`;

export function Text(props) {
  const {
    children,
    IconComponent,
    iconSize,
    ...rest
  } = props;

  const theme = useAdminTheme();

  const buttonRef = React.useRef(null);
  const isHovering = useIsHovering(buttonRef);

  const iconColor = rest.buttonFg;
  const iconHoverColor = rest.hoverButtonFg;

  const finalIconColor = !!IconComponent && isHovering
    ? (!!iconHoverColor && iconHoverColor(theme.colors))
    : (!!iconColor && iconColor(theme.colors));

  return (
    <TextButtonWrapper ref={buttonRef} {...rest}>
      {!!IconComponent && (
        <IconComponent
          width={iconSize}
          height={iconSize}
          color={finalIconColor}
        />
      )}
      {children}
    </TextButtonWrapper>
  );
}

const IconButtonWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;

  ${({ disabled }) => !!disabled && css`
    cursor: not-allowed;
  `}

  svg * {
    transition: stroke 0.4s, fill 0.4s;
  }
`;

// TODO: rename to "Icon"
export function IconButton(props) {
  const {
    IconComponent,
    color,
    hoverColor,
    width = 24,
    height = 24,
    tooltipProps,
    ...rest
  } = props;

  const theme = useAdminTheme();

  const buttonRef = React.useRef(null);
  const isHovering = useIsHovering(buttonRef);

  const iconColor = !!(isHovering && hoverColor)
    ? hoverColor(theme.colors)
    : color(theme.colors);

  return (
    <IconButtonWrapper ref={buttonRef} {...rest}>
      <IconComponent
        width={width}
        height={height}
        color={iconColor}
      />
    </IconButtonWrapper>
  );
}
