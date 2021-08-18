import React from 'react';
import Cookies from 'js-cookie';

export const LOGOUT_ROUTE = '/logout';

export default function Logout() {
  React.useEffect(() => {
    Cookies.remove('lf_auth');
    window.location.href = '/';
  }, []);

  return null;
}
