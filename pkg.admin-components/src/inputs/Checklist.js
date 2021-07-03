import React from 'react';
import styled, { css, useTheme } from 'styled-components';
import DoneIcon from '@ac/icons/done';
import { Column } from '@ac/Flex';
import Typography from '@ac/Typography';

export default function Checklist(props) {
  const {
    fieldId,
    labelledBy,
    setValue,
    value = null,
    options = [],
  } = props;

  const theme = useTheme();

  const activeOption = !!value && options.find((option) => option.key === value);

  // TODO:
  // function onFocus() {
  //   let initialFocusId = null;
  //
  //   if (activeOption) {
  //     initialFocusId = `${fieldId}-${value}`;
  //   } else if (!!options && !!options[0]) {
  //     initialFocusId = `${fieldId}-${options[0].key}`;
  //   }
  //
  //   console.log(initialFocusId)
  //   if (initialFocusId) {
  //     document.getElementById(initialFocusId).focus();
  //   }
  // }
  //
  // function onKeyDown(event) {
  //   console.log(event);
  // }

  return (
    <Column
      role="listbox"
      aria-labelledby={labelledBy}
      aria-activedescendant={activeOption ? `${fieldId}-${value}` : ''}
      // tabIndex="0"
      // onKeyDown={onKeyDown}
      // onFocus={onFocus}
      gridGap="6px"
      fullWidth
    >
      {options.map((option) => {
        const isSelected = value === option.key;

        return (
          <Option
            key={option.key}
            id={`${fieldId}-${value}`}
            role="option"
            aria-selected={`${isSelected}`}
            isSelected={isSelected}
            isDisabled={false}
            onClick={() => setValue(option.key)}
          >
            <DoneIcon
              color={isSelected ? theme.colors.mono[900] : theme.colors.mono[100]}
              width={16}
              height={16}
            />
            <Typography
              id={`${fieldId}-${option.key}`}
              fontStyle="regular"
              fontSize="18px"
              fg={(colors) => isSelected ? colors.mono[900] : colors.mono[500]}
            >
              {option.label}
            </Typography>
          </Option>
        );
      })}
    </Column>
  );
}

const Option = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 6px;
  padding: 6px;
  width: 100%;

  cursor: pointer;
  border-radius: ${(props) => props.theme.rounded.default};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: color, background-color;

  background-color: ${(props) => props.theme.colors.mono[100]};
  border: 1px solid ${(props) => props.theme.colors.mono[500]};

  ${(props) => !props.isDisabled && css`
    ${props.isSelected && css`
      border: 1px solid ${props.theme.colors.mono[900]};
    `}

    &:hover {
      border: 1px solid ${props.theme.colors.mono[700]};

      ${Typography} {
        color: ${props.theme.colors.mono[700]};
      }
    }
  `}
`;
