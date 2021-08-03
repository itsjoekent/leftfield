import React from 'react';
import qs from 'qs';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import useProductApi from '@product/hooks/useProductApi';

export default function FileSelector(props) {
  const { accepts, onSelect } = props;

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const [isRequesting, setIsRequesting] = React.useState(false);

  async function nextPage() {
    setIsRequesting(true);

    try {
      const queryParams = {};

      if (accepts && accepts.length) {
        queryParams.fileTypes = accepts;
      }

      if (searchQuery && searchQuery.length) {
        queryParams.name = searchQuery;
      }

      if (searchResults.length) {
        queryParams.startAt = [...searchResults].pop().id;
      }

      await hitApi(
        'get',
        `/organization/files?${qs.stringify(queryParams)}`,
        null,
        ({ ok, json }) => {
          if (ok) {
            setSearchResults((existing) => [...existing, ...get(json, 'files', [])]);
          }

          setIsRequesting(false);
        }
      );
    } catch (error) {
      console.error(error);

      setIsRequesting(false);
      dispatch(pushSnack({
        message: 'Error uploading image',
        type: SPICY_SNACK,
      }));
    }
  }

  React.useEffect(() => nextPage(), []);

  console.log(searchResults);

  return (
    <ModalDefaultLayout width="600px" title="File selector">
      {/*  */}
    </ModalDefaultLayout>
  );
}
