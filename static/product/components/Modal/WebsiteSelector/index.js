import React from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import {
  Buttons,
  Flex,
  Typography,
} from 'pkg.admin-components';
import ModalDefaultLayout from '@product/components/Modal/DefaultLayout';
import { setWebsiteId } from '@product/features/assembly';
import { setModal } from '@product/features/modal';
import useProductApi from '@product/hooks/useProductApi';

export default function WebsiteSelector() {
  const dispatch = useDispatch();
  const hitApi = useProductApi();

  const [isBuiding, setIsBuilding] = React.useState(false);

  function onCreateBlank() {
    if (isBuiding) {
      return;
    }

    setIsBuilding(true);

    hitApi({
      method: 'post',
      route: '/website',
      onResponse: ({ json, ok }) => {
        setIsBuilding(false);

        if (ok) {
          dispatch(setWebsiteId({ websiteId: get(json, 'website.id') }));
          dispatch(setModal({ type: null }));
        }
      },
      onFatalError: () => setIsBuilding(false),
    });
  }

  return (
    <ModalDefaultLayout
      width="600px"
      title="Websites"
      disableClose
    >
      <Flex.Column fullWidth bg={(colors) => colors.mono[100]}>
        <Buttons.Filled
          paddingVertical="4px"
          paddingHorizontal="8px"
          buttonFg={(colors) => colors.mono[100]}
          buttonBg={(colors) => colors.blue[500]}
          hoverButtonBg={(colors) => colors.blue[700]}
          isLoading={isBuiding}
          onClick={onCreateBlank}
        >
          <Typography
            fontStyle="bold"
            fontSize="16px"
          >
            Create new website
          </Typography>
        </Buttons.Filled>
      </Flex.Column>
    </ModalDefaultLayout>
  );
}
