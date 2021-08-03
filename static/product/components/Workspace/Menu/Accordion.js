import React from 'react';
import styled, { css } from 'styled-components';
import {
  Flex,
  Icons,
  Typography,
} from 'pkg.admin-components';

export default function Accordion(props) {
  const {
    title,
    isExpanded,
    setIsExpanded,
    children,
  } = props;

  return (
    <Container
      isExpanded={isExpanded}
      rounded={(radius) => radius.default}
      shadow={(shadow) => shadow.light}
      bg={(colors) => colors.mono[100]}
    >
      <ToggleButton
        aria-expanded={isExpanded}
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography
          fontStyle="bold"
          fontSize="16px"
          fg={(colors) => colors.mono[700]}
        >
          {title}
        </Typography>
        <Icons.ExpandUp />
      </ToggleButton>
      <Flex.Column position="relative" flexGrow>
        <ContentContainer>
          {children}
        </ContentContainer>
      </Flex.Column>
    </Container>
  );
}

const ContentContainer = styled(Flex.Column)`
  visibility: hidden;
  opacity: 0;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  padding: 12px;
  padding-bottom: 24px;
  overflow-y: scroll;

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: visibility, opacity;
`;

const Container = styled(Flex.Column)`
  border: none;
  flex: ${(props) => props.isExpanded ? '1' : '0'};
  transition: flex ${(props) => props.theme.animation.defaultTransition} ${(props) => props.isExpanded ? 'ease-in' : 'ease-out'};

  ${ContentContainer} {
    visibility: ${(props) => props.isExpanded ? 'visible' : 'hidden'};
    opacity: ${(props) => props.isExpanded ? '1' : '0'};
  }
`;

const ToggleButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 12px;

  border: none;
  border-top-left-radius: ${(props) => props.theme.rounded.default};
  border-top-right-radius: ${(props) => props.theme.rounded.default};

  ${(props) => !props.isExpanded && css`
    border-radius: ${(props) => props.theme.rounded.default};
  `}

  cursor: pointer;
  background-color: ${(props) => props.theme.colors.mono[200]};

  &:hover {
    background-color: ${(props) => props.theme.colors.mono[300]};
  }

  svg {
    transform: rotate(${(props) => props.isExpanded ? '0' : '180deg'});
    transition: transform ${(props) => props.theme.animation.defaultTransition};

    path {
      fill: ${(props) => props.theme.colors.mono[700]};
    }
  }
`;
