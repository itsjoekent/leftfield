import React from 'react';
import { get, uniqBy } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  Block,
  Buttons,
  Flex,
  Grid,
  Typography,
} from 'pkg.admin-components';
import SearchBar from '@product/components/SearchBar';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import FileSelectorResult from '@product/components/Modal/FileSelector/Result';
import { closeModal } from '@product/features/modal';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useDebounce from '@product/hooks/useDebounce';
import useProductApi from '@product/hooks/useProductApi';

export default function FileSelector(props) {
  const { accepts, onSelect } = props;

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [isRequesting, setIsRequesting] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);

  const onSelectWrapper = React.useCallback((file) => {
    onSelect(file);
    dispatch(closeModal());
  }, [onSelect]);

  const onStart = React.useCallback(() => setIsRequesting(true), []);

  const onComplete = React.useCallback((value) => {
    setSearchResults([]);
    nextPage(value);
  }, []);

  const [searchQuery, setSearchQuery] = useDebounce({ onStart, onComplete });

  async function nextPage(name = searchQuery) {
    setIsRequesting(true);

    try {
      const queryParams = {};

      if (accepts && accepts.length) {
        queryParams.fileTypes = accepts;
      }

      if (name && name.length) {
        queryParams.name = name;
      }

      if (searchResults.length) {
        queryParams.startAt = [...searchResults].pop().id;
      }

      hitApi({
        method: 'get',
        route: '/organization/files',
        query: queryParams,
        onResponse: ({ ok, json }) => {
          if (ok) {
            setSearchResults((existing) => uniqBy(
              [...existing, ...get(json, 'files', [])],
              'id',
            ));
          }

          setIsRequesting(false);
        },
        onFatalError: () => setIsRequesting(false),
      });
    } catch (error) {
      console.error(error);

      setIsRequesting(false);
      dispatch(pushSnack({
        message: 'Error uploading image',
        type: SPICY_SNACK,
      }));
    }
  }

  React.useEffect(() => {
    setSearchResults([]);
    nextPage();
  }, [accepts]);

  return (
    <ModalDefaultLayout width="800px" title="File selector">
      <Flex.Column
        gridGap="24px"
        fullWidth
        maxHeight="60vh"
        overflowY="scroll"
        bg={(colors) => colors.mono[100]}
        padding="24px"
      >
        <SearchBar
          label="Search files"
          placeholder="Search files"
          searchValue={searchQuery}
          setSearchValue={setSearchQuery}
        />
        {!!isRequesting && !searchResults.length && (
          <Grid
            columns="1fr 1fr 1fr 1fr"
            gap="12px"
          >
            <Block
              minHeight="180px"
              playFadeIn
              bg={(colors) => colors.mono[200]}
            />
            <Block
              minHeight="180px"
              playFadeIn
              bg={(colors) => colors.mono[200]}
            />
            <Block
              minHeight="180px"
              playFadeIn
              bg={(colors) => colors.mono[200]}
            />
          </Grid>
        )}
        {!!searchResults.length && (
          <Flex.Column gridGap="12px" align="center">
            <Grid
              columns="1fr 1fr 1fr 1fr"
              gap="12px"
            >
              {searchResults.map((file) => (
                <FileSelectorResult
                  key={file.id}
                  file={file}
                  onSelect={onSelectWrapper}
                />
              ))}
              {isRequesting && (
                <React.Fragment>
                  <Block
                    minHeight="180px"
                    playFadeIn
                    bg={(colors) => colors.mono[200]}
                  />
                  <Block
                    minHeight="180px"
                    playFadeIn
                    bg={(colors) => colors.mono[200]}
                  />
                  <Block
                    minHeight="180px"
                    playFadeIn
                    bg={(colors) => colors.mono[200]}
                  />
                </React.Fragment>
              )}
            </Grid>
            <Buttons.Filled
              type="submit"
              fitWidth
              buttonFg={(colors) => colors.mono[100]}
              buttonBg={(colors) => colors.blue[500]}
              hoverButtonBg={(colors) => colors.blue[700]}
              paddingVertical="4px"
              paddingHorizontal="8px"
              isLoading={isRequesting}
              onClick={() => nextPage()}
            >
              <Typography fontStyle="medium" fontSize="14px">
                Load more
              </Typography>
            </Buttons.Filled>
          </Flex.Column>
        )}
        {!isRequesting && !searchResults.length && (
          <Flex.Row
            minHeight="180px"
            align="center"
            justify="center"
          >
            <Typography
              fontStyle="regular"
              fontSize="16px"
              fg={(colors) => colors.mono[700]}
            >
              No results found
            </Typography>
          </Flex.Row>
        )}
      </Flex.Column>
    </ModalDefaultLayout>
  );
}
