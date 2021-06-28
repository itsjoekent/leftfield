import React from 'react';
import styled from 'styled-components';
import {
  Buttons,
  Flex,
  Icons,
  Tooltip,
  useAdminTheme,
} from 'pkg.admin-components';

export default function SearchBar(props) {
  const theme = useAdminTheme();

  const [searchValue, setSearchValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Container
      align="center"
      gridGap="12px"
      padding="12px"
      shadow={(shadow) => isFocused && shadow.light}
      bg={(colors) => colors.mono[props.isFocused ? 100 : 200]}
      rounded={(radius) => radius.default}
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
      <Tooltip copy="Search filters" point={Tooltip.UP}>
        <Buttons.IconButton
          IconComponent={Icons.Filter}
          color={(theme) => theme.colors.mono[500]}
          hoverColor={(theme) => theme.colors.mono[700]}
          aria-label="Search filters"
        />
      </Tooltip>
    </Container>
  );
}

const Container = styled(Flex.Row)`
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
