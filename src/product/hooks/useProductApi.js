import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { selectAuthToken } from '@product/features/auth';
import { pushSnack, SPICY_SNACK } from '@product/features/snacks';
import { LOGIN_ROUTE } from '@product/routes/Login';

export default function useProductApi(
  triggerSnacks = true,
  redirectToLogin = true,
) {
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const [, setLocation] = useLocation();

  async function hitApi(method, functionName, payload, onResponse = () => {}) {
    const url = `/.netlify/functions/${functionName}`;

    try {
      const fetchOptions = {
        method,
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${authToken}`,
        },
      };

      if (payload && method.toLowerCase() !== 'get') {
        fetchOptions['body'] = JSON.stringify(payload);
      }

      const response = await fetch(url, fetchOptions);
      const { ok, status } = response;

      if (redirectToLogin && status === 401) {
        setLocation(LOGIN_ROUTE);
        return;
      }

      if (status === 201) {
        onResponse({ status, ok, json: {} });
        return;
      }

      const json = await response.json();

      if (status >= 400) {
        const returnedErrorMessage = get(json, 'error.message');
        const errorId = get(json, 'error.id');

        if (errorId) {
          console[status >= 500 ? 'error' : 'log'](
            `[Error ID="${errorId}"] ${returnedErrorMessage}`,
          );
        }

        if (triggerSnacks) {
          dispatch(pushSnack({
            message: returnedErrorMessage || 'Encountered unexpected error, try again?',
            type: SPICY_SNACK,
          }));
        }
      }

      onResponse({ status, json, ok });
    } catch (error) {
      console.error(error);
      dispatch(pushSnack({
        message: 'Encountered unexpected error, try again?',
        type: SPICY_SNACK,
      }));
    }
  }

  return hitApi;
}
