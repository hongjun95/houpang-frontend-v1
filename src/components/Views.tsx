import { Link, Toolbar, View, Views } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import CustomPanel from '@components/shared/CustomPanel';
import useAuth from '@hooks/useAuth';
import LandingPage from '@pages/landing';
import { destroyToken, getShoppingList, getToken, IShoppingItem } from '@store';
import { sleep } from '@utils/index';
import { likeKeys } from '@reactQuery/query-keys';
import { FindLikeListOutput, Like } from '@interfaces/like.interface';
import { findLikeList } from '@api';
import { useSetRecoilState } from 'recoil';
import { likeListAtom, shoppingListAtom } from '@atoms';
import { PageRouteProps } from '@constants';

const F7Views = ({ f7route }: PageRouteProps) => {
  const { currentUser, isAuthenticated, authenticateUser, unAuthenticateUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setLikeList = useSetRecoilState<Like>(likeListAtom);
  const setShoppingList = useSetRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const logoutHandler = useCallback(async () => {
    unAuthenticateUser();
  }, [unAuthenticateUser]);

  useEffect(() => {
    (async function checkToken() {
      try {
        authenticateUser(getToken());
      } catch {
        destroyToken();
        unAuthenticateUser();
      } finally {
        await sleep(700);
        setIsLoading(false);
      }
    })();
  }, []);

  const { data, status } = useQuery<FindLikeListOutput, Error>(likeKeys.detail(currentUser?.id), findLikeList);
  if (status === 'success') {
    setLikeList(data.likeList);
    setShoppingList(getShoppingList(currentUser?.id || ''));
  }

  if (isLoading) {
    return <LandingPage />;
  }

  const loggedInViews = () => (
    <Views tabs className="safe-areas">
      <Toolbar tabbar labels bottom className="">
        {/* <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
        <Link tabLink="#view-items" icon="las la-gift" text="쇼핑" />
        <Link tabLink="#view-users" icon="las la-address-book" text="사용자" />
        <Link tabLink="#view-contacts" icon="las la-edit" text="문의하기" />
        <Link tabLink="#view-mypage" icon="las la-user" text="마이페이지" /> */}
        <Link className="w-1/6 flex flex-col items-center" href="/" tabLinkActive icon="las la-home" text="홈" />
        <Link className="w-1/6 flex flex-col items-center" href="/items?is_main=true/" icon="las la-gift" text="쇼핑" />
        <Link
          className="w-1/6 flex flex-col items-center"
          href="/users?is_main=true"
          icon="las la-address-book"
          text="사용자"
        />
        <Link
          className="w-1/6 flex flex-col items-center"
          href="/contacts?is_main=true"
          icon="las la-edit"
          text="문의하기"
        />
        <Link
          className="w-1/6 flex flex-col items-center"
          href="/mypage?is_main=true"
          icon="las la-user"
          text="마이페이지"
        />
      </Toolbar>
      <View id="view-home" stackPages main iosDynamicNavbar={false} />
      <View id="view-items" stackPages name="items" />
      <View id="view-users" stackPages name="users" />
      <View id="view-contacts" stackPages name="contacts" />
      <View id="view-mypage" stackPages name="mypage" />
      {/* <View id="view-home" stackPages main tab tabActive url="/" iosDynamicNavbar={false} />
      <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" />
      <View id="view-users" stackPages name="users" tab url="/users?is_main=true" />
      <View id="view-contacts" stackPages name="contacts" tab url="/contacts?is_main=true" />
      <View id="view-mypage" stackPages name="mypage" tab url="/mypage?is_main=true" /> */}
    </Views>
  );

  const loggedOutViews = () => <View id="view-intro" main url="/intro" />;

  return (
    <>
      <CustomPanel handleLogout={logoutHandler} isLoggedIn={isAuthenticated} currentUser={currentUser} />
      {isAuthenticated ? loggedInViews() : loggedOutViews()}
    </>
  );
};

export default F7Views;
