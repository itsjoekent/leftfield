import React from 'react';
import { get } from 'lodash';
import { batch, useDispatch, useSelector } from 'react-redux';
import {
  setAccount,
  setOrganization,
  selectAuthAccount,
  selectIsAuthenticated,
} from '@product/features/auth';
import useProductApi from '@product/hooks/useProductApi';

export default function Init() {
  const account = useSelector(selectAuthAccount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const hitApi = useProductApi();

  React.useEffect(() => {
    if (!account && !!isAuthenticated) {
      hitApi({
        method: 'get',
        route: '/profile',
        onResponse: ({ json, ok }) => {
          if (ok) {
            batch(() => {
              dispatch(setAccount(get(json, 'account')));
              dispatch(setOrganization(get(json, 'organization')));
            });
          }
        },
      });
    }
  }, [account, isAuthenticated]);

  return null;
}
