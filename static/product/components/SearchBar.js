import React from 'react';
import styled from 'styled-components';
import {
  Buttons,
  Flex,
  Icons,
  Inputs,
  Tooltip,
  useAdminTheme,
} from 'pkg.admin-components';

export default function SearchBar(props) {
  const {
    label,
    placeholder,
    searchValue,
    setSearchValue,
    searchFilters = null,
  } = props;

  const theme = useAdminTheme();

  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Flex.Row
      align="center"
      gridGap="12px"
      padding="12px"
      shadow={(shadow) => isFocused && shadow.light}
      bg={(colors) => colors.mono[props.isFocused ? 100 : 200]}
      rounded={(radius) => radius.default}
      transition={['background-color', 'box-shadow']}
    >
      <Flex.Row align="center" gridGap="6px" flexGrow>
        <Icons.Search color={theme.colors.mono[500]} />
        <SearchInput
          aria-label={label}
          placeholder={placeholder}
          isFocused={isFocused}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Flex.Row>
      {!!searchFilters && (
        <Tooltip copy="Search filters" point={Tooltip.UP}>
          <Buttons.IconButton
            IconComponent={Icons.Filter}
            color={(colors) => colors.mono[500]}
            hoverColor={(colors) => colors.mono[700]}
            aria-label="Search filters"
          />
        </Tooltip>
      )}
    </Flex.Row>
  );
}

const SearchInput = styled(Inputs.DefaultText)`
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
