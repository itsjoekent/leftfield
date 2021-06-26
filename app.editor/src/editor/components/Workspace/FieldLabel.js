import React from 'react';
import styled from 'styled-components';
import { Flex, Icons, useAdminTheme } from 'pkg.admin-components';

export default function FieldLabel(props) {
  const {
    labelCopy,
    labelFor,
    isRequired,
    help,
  } = props;

  const theme = useAdminTheme();
  const hasInfo = !!help;

  return (
    <Flex.Row hasInfo={hasInfo} justify="space-between" align="center">
      <Flex.Row
        flexGrow
        gridGap="4px"
        align="center"
        overflowX="hidden"
      >
        <LabelCopy htmlFor={labelFor || ''}>{labelCopy}</LabelCopy>
        <HintCopy>{isRequired ? '(required)' : '(optional)'}</HintCopy>
      </Flex.Row>
      {hasInfo && (
        <Icons.InfoLight color={theme.colors.mono[400]} />
      )}
    </Flex.Row>
  );
}

const LabelCopy = styled.label`
  ${(props) => props.theme.fonts.main.bold};
  font-size: 14px;
  letter-spacing: 2%;
  color: ${(props) => props.theme.colors.mono[700]};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const HintCopy = styled.span`
  ${(props) => props.theme.fonts.main.light};
  color: ${(props) => props.theme.colors.mono[400]};
`;
