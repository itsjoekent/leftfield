import React from 'react';
import styled, { css } from 'styled-components';
import Typography from '@ac/Typography';
import generics from '@ac/generics';
import useAdminTheme from '@ac/useAdminTheme';
import useIsHovering from '@ac/useIsHovering';

const FilledButtonWrapper = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: fit-content;
  cursor: pointer;
  border-radius: ${(props) => props.theme.rounded.extra};
  border-style: solid;

  ${({ buttonBg, theme }) => !!buttonBg && css`
    border-color: ${buttonBg(theme.colors)};
    background-color: ${buttonBg(theme.colors)};
  `}

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: border, background-color, box-shadow;

  ${Typography} {
    transition: color ${(props) => props.theme.animation.defaultTransition};
    ${({ buttonFg, theme }) => !!buttonFg && css`color: ${buttonFg(theme.colors)};`}
  }

  &:hover {
    ${({ buttonFg, theme }) => !!buttonFg && css`background-color: ${buttonFg(theme.colors)};`}

    ${Typography} {
      ${({ buttonBg, theme }) => !!buttonBg && css`color: ${buttonBg(theme.colors)};`}
    }
  }

  svg * {
    transition: all ${(props) => props.theme.animation.defaultTransition};
    transition-property: stroke, fill;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}
  ${generics}
`;

export function Filled(props) {
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
  const iconHoverColor = rest.buttonBg;

  const finalIconColor = !!IconComponent && isHovering
    ? (!!iconHoverColor && iconHoverColor(theme.colors))
    : (!!iconColor && iconColor(theme.colors));

  return (
    <FilledButtonWrapper ref={buttonRef} {...rest}>
      {!!IconComponent && (
        <IconComponent
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: fit-content;
  cursor: pointer;
  border-radius: ${(props) => props.theme.rounded.extra};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: border, background, box-shadow;

  ${Typography} {
    transition: color ${(props) => props.theme.animation.defaultTransition};
    ${({ borderColor, theme }) => !!borderColor && css`color: ${borderColor(theme.colors)};`}
  }

  ${({ hoverBorderColor, theme }) => !!hoverBorderColor && css`
    &:hover ${Typography} {
      color: ${hoverBorderColor(theme.colors)};
    }
  `}

  svg * {
    transition: all ${(props) => props.theme.animation.defaultTransition};
    transition-property: stroke, fill;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ gridGap }) => !!gridGap && css`grid-gap: ${gridGap};`}
  ${generics}
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
