import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { selectIsAuthenticated } from '@product/features/auth';

import { LOGIN_ROUTE } from '@product/routes/Login';

export default function useAuthGate(redirectTo = LOGIN_ROUTE) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [location, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated && location !== redirectTo) {
      setLocation(redirectTo);
    }
  }, [
    isAuthenticated,
    location,
    redirectTo,
  ]);
}
