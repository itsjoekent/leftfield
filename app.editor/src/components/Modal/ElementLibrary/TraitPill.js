import React from 'react';
import styled, { css } from 'styled-components';

export default function TraitPill(props) {
  const {
    label = '',
    isSelected = false,
    setIsSelected = () => {},
  } = props;

  return (
    <Button
      aria-label={`Filter for ${label} components`}
      aria-pressed={isSelected.toString()}
      isSelected={isSelected}
      onClick={setIsSelected}
    >
      {label}
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 4px 12px;
  margin: 0;

  color: ${(props) => props.theme.colors.mono[500]};
  background-color: ${(props) => props.theme.colors.mono[100]};
  border: 1px solid ${(props) => props.theme.colors.mono[500]};
  border-radius: ${(props) => props.theme.rounded.extra};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: color, background-color, border;

  ${(props) => props.theme.fonts.main.regular};
  font-size: 14px;
  letter-spacing: 2%;

  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.mono[900]};
    border: 1px solid ${(props) => props.theme.colors.mono[900]};
  }

  ${(props) => props.isSelected && css`
    color: ${(props) => props.theme.colors.mono[100]};
    background-color: ${(props) => props.theme.colors.mono[900]};
    border: 1px solid ${(props) => props.theme.colors.mono[900]};

    &:hover {
      color: ${(props) => props.theme.colors.mono[400]};
      border: 1px solid ${(props) => props.theme.colors.mono[900]};
    }
  `}
`;
