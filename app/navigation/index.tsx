import React from 'react';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Navigation = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isParent = useSelector((state: RootState) => 
    state.auth.users?.[user?.uid]?.isParent ?? false
  );

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return isParent ? (
    <Redirect href="/parent/dashboard" />
  ) : (
    <Redirect href="/child/home" />
  );
};

export default Navigation;
