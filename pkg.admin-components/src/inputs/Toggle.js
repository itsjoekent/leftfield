import React from 'react';
import styled, { css } from 'styled-components';

export default function Toggle(props) {
  const {
    labelledBy = '',
    onLabel = 'On',
    offLabel = 'Off',
    value = false,
    isDisabled = false,
    setValue = () => {},
    styleFunctions = {
      onColorText: (colors) => colors.mono[200],
      onColorBg: (colors) => colors.mono[700],
      offColorText: (colors) => colors.mono[500],
      offColorBg: (colors) => colors.mono[200],
      onHoverColorText: (colors) => colors.mono[900],
      onHoverColorBg: (colors) => colors.mono[400],
    },
  } = props;

  function toggle() {
    setValue(!value);
  }

  return (
    <Container
      type="button"
      role="switch"
      aria-checked={value.toString()}
      aria-labelledby={labelledBy}
      aria-readonly={isDisabled.toString()}
      onClick={toggle}
      isDisabled={isDisabled}
    >
      <Half
        active={!!value}
        isDisabled={isDisabled}
        styleFunctions={styleFunctions}
      >
        {onLabel}
      </Half>
      <Half
        active={!value}
        isDisabled={isDisabled}
        styleFunctions={styleFunctions}
      >
        {offLabel}
      </Half>
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
  padding: 0;
  margin: 0;

  cursor: default;
  border: none;
  border-radius: ${(props) => props.theme.rounded.default};
  background: none;

  ${(props) => props.isDisabled && css`
    cursor: not-allowed;
    opacity: 0.8;
  `}
`;

const Half = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 6px;

  font-family: ${(props) => props.theme.fonts.main.medium};
  font-size: 16px;

  box-shadow: none;

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: color, background-color, box-shadow;


  ${(props) => props.active && css`
    color: ${(props) => props.styleFunctions.onColorText(props.theme.colors)};
    background-color: ${(props) => props.styleFunctions.onColorBg(props.theme.colors)};
    box-shadow: ${(props) => props.theme.shadow.light};
  `}

  ${(props) => !props.active && !props.isDisabled && css`
    cursor: pointer;

    &:hover {
      color: ${(props) => props.styleFunctions.onHoverColorText(props.theme.colors)};
      background-color: ${(props) => props.styleFunctions.onHoverColorBg(props.theme.colors)};
    }
  `}

  ${(props) => !props.active && css`
    color: ${(props) => props.styleFunctions.offColorText(props.theme.colors)};
    background-color: ${(props) => props.styleFunctions.offColorBg(props.theme.colors)};
  `}
`;
