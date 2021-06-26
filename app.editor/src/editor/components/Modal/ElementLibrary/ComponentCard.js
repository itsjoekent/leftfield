import React from 'react';
import { get } from 'lodash';
import styled from 'styled-components';

export default function ComponentCard(props) {
  const {
    componentMeta,
    onClick,
  } = props;

  const name = get(componentMeta, 'name');
  const shortDescription = get(componentMeta, 'shortDescription', null);

  return (
    <Container
      aria-label={`Add the ${name} component`}
      onClick={onClick}
    >
      <ComponentTitle>
        {name}
      </ComponentTitle>
      {!!shortDescription && (
        <ComponentDescription>
          {shortDescription}
        </ComponentDescription>
      )}
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  flex-direction: column;
  grid-gap: 6px;

  cursor: pointer;

  background-color: ${(props) => props.theme.colors.mono[100]};
  border: 1px solid ${(props) => props.theme.colors.mono[100]};
  border-radius: ${(props) => props.theme.rounded.default};
  ${(props) => props.theme.shadow.light};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: box-shadow, border;

  padding: 12px;
  margin: 0;

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[100]};
    border: 1px solid ${(props) => props.theme.colors.mono[300]};
    box-shadow: none;
  }
`;

const ComponentTitle = styled.p`
  ${(props) => props.theme.fonts.main.medium};
  font-size: 14px;
  color: ${(props) => props.theme.colors.purple[300]};
`;

const ComponentDescription = styled.p`
  ${(props) => props.theme.fonts.main.light};
  font-size: 12px;
  color: ${(props) => props.theme.colors.mono[600]};
`;
