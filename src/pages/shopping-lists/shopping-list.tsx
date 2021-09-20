import React, { useState } from 'react';
import { Navbar, Page } from 'framework7-react';
import styled from 'styled-components';

import { IShoppingItem } from '@store';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Like } from '@interfaces/like.interface';
import { likeListAtom, shoppingListAtom } from '@atoms';
import NormalBuying from '@components/NormalBuying';
import LikeList from '@components/LikeList';

type PageToggle = 'NormalBuying' | 'Like';

const ToggleButton = styled.button`
  :nth-child(1).current_page ~ .indicator {
    transform: translateX(calc(0%));
  }
  :nth-child(2).current_page ~ .indicator {
    transform: translateX(calc(100%));
  }
`;
const Indicator = styled.div`
  height: 1px;
  transition: 0.3s;
`;

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
      <div className="flex w-full relative">
        <ToggleButton
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'NormalBuying' ? 'text-blue-700  py-4 current_page' : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToNormalBuying}
        >
          <span className="">일반구매({shoppingList.length})</span>
        </ToggleButton>
        <ToggleButton
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'Like' ? 'text-blue-700 py-4 current_page' : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToLike}
        >
          <span>찜한상품({likeList.products.length})</span>
        </ToggleButton>
        <Indicator className="indicator absolute left-0 bottom-0 w-1/2 bg-blue-700"></Indicator>
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
