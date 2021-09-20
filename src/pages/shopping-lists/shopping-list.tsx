import React, { useState } from 'react';
import { Navbar, Page } from 'framework7-react';

import { IShoppingItem } from '@store';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Like } from '@interfaces/like.interface';
import { likeListAtom, shoppingListAtom } from '@atoms';
import NormalBuying from '@components/NormalBuying';
import LikeList from '@components/LikeList';

type PageToggle = 'NormalBuying' | 'Like';

const ShoppingListPage = ({ f7router }: PageRouteProps) => {
  const { currentUser } = useAuth();
  const [page, setPage] = useState<PageToggle>('NormalBuying');
  const [shoppingList, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);
  const likeList = useRecoilValue<Like>(likeListAtom);

  const changeToLike = () => {
    setPage('Like');
  };

  const changeToNormalBuying = () => {
    setPage('NormalBuying');
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      <div className="flex w-full">
        <button
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'NormalBuying'
              ? 'text-blue-700 border-b-2 border-blue-700 py-4'
              : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToNormalBuying}
        >
          <span className="">일반구매({shoppingList.length})</span>
        </button>
        <button
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'Like' ? 'text-blue-700 border-b-2 border-blue-700 py-4' : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToLike}
        >
          <span>찜한상품({likeList.products.length})</span>
        </button>
      </div>
      {page === 'NormalBuying' ? (
        <NormalBuying
          f7router={f7router}
          currentUser={currentUser}
          shoppingList={shoppingList}
          setShoppingList={setShoppingList}
        />
      ) : (
        <LikeList
          currentUser={currentUser} //
          setShoppingList={setShoppingList}
        />
      )}
    </Page>
  );
};

export default React.memo(ShoppingListPage);
