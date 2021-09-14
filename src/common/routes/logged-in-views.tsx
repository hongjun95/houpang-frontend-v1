import React, { useCallback, useEffect, useState } from 'react';
import { Views, Toolbar, Link, View } from 'framework7-react';
import { sleep } from '@utils/index';

import CustomPanel from '@components/shared/CustomPanel';
import useAuth from '@hooks/useAuth';
import { destroyToken, getToken } from '@store';

const LoggedInViews = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser, isAuthenticated, authenticateUser, unAuthenticateUser } = useAuth();
  console.log("currentUser");
  console.log(currentUser);
  const logoutHandler = useCallback(async () => {
    unAuthenticateUser();
  }, [unAuthenticateUser]);

  useEffect(() => {
    (async function checkToken() {
      try {
        // const response = await refresh();
        // saveToken(response.data);
        authenticateUser(getToken());
      } catch {
        destroyToken();
        unAuthenticateUser();
      } finally {
        await sleep(700);
        setIsLoading(false);
      }
    })();
    console.log('useEffect');
    console.log(getToken());
  }, []);

  return (
    <>
      <CustomPanel handleLogout={logoutHandler} isLoggedIn={isAuthenticated} currentUser={currentUser} />
      <Views tabs className="safe-areas">
        <Toolbar tabbar labels bottom>
          <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
          <Link tabLink="#view-items" icon="las la-gift" text="쇼핑" />
          <Link tabLink="#view-users" icon="las la-address-book" text="사용자" />
          <Link tabLink="#view-contacts" icon="las la-edit" text="문의하기" />
          <Link tabLink="#view-mypage" icon="las la-user" text="마이페이지" />
        </Toolbar>
        <View id="view-home" stackPages main tab tabActive url="/" iosDynamicNavbar={false} />
        <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" />
        <View id="view-users" stackPages name="users" tab url="/users?is_main=true" />
        <View id="view-contacts" stackPages name="contacts" tab url="/contacts?is_main=true" />
        <View id="view-mypage" stackPages name="mypage" tab url="/mypage?is_main=true" />
      </Views>
    </>
  );
};

export default React.memo(LoggedInViews);
