import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from 'src/app/hooks';
import { getSessionToken } from 'src/scenes/Savings/OnBoarding/store/selectors';

export function RequireSession({ children }: { children: JSX.Element }) {
  let location = useLocation();

  if (!useAppSelector(getSessionToken)) {
    return <Navigate to="/session-expired" state={{ from: location }} replace />;
  } else {
    return children;
  }
}
