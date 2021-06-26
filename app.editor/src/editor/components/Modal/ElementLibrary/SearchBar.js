import React from 'react';
import styled from 'styled-components';
import { Buttons, Flex, Icons, useAdminTheme } from 'pkg.admin-components';

export default function SearchBar(props) {
  const theme = useAdminTheme();

  const [searchValue, setSearchValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Container
      isFocused={isFocused}
      align="center"
      gridGap="12px"
      padding="12px"
    >
      <Flex.Row align="center" gridGap="6px" flexGrow>
        <Icons.Search color={theme.colors.mono[500]} />
        <SearchInput
          aria-label="Search element library"
          placeholder="Search for components"
          isFocused={isFocused}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Flex.Row>
      <Buttons.IconButton
        IconComponent={Icons.Filter}
        color={theme.colors.mono[500]}
        hoverColor={theme.colors.mono[700]}
      />
    </Container>
  );
}

const Container = styled(Flex.Row)`
  background-color: ${(props) => props.theme.colors.mono[props.isFocused ? 100 : 200]};
  border-radius: ${(props) => props.theme.rounded.default};
  ${(props) => props.isFocused && props.theme.shadow.light};

  transition: all ${(props) => props.theme.animation.defaultTransition};
  transition-property: background-color, box-shadow;
`;

const SearchInput = styled.input`
  ${(props) => props.theme.fonts.main.regular};
  font-size: 16px;
  color: ${(props) => props.theme.colors.mono[props.isFocused ? 700 : 500]};
  flex-grow: 1;

  border: none;
  background: none;
  outline: none;
  padding: 0;
  margin: 0;
`;
