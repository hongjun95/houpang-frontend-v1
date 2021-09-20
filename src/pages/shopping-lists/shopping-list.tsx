import React, { useState } from 'react';
import { Checkbox, Link, Navbar, Page, Stepper, Toolbar } from 'framework7-react';

import { formmatPrice } from '@utils/index';
import { saveShoppingList, IShoppingItem } from '@store';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Like } from '@interfaces/like.interface';
import { likeListAtom, shoppingListAtom } from '@atoms';
import NormalBuying from '@components/NormalBuying';
import styled from 'styled-components';

type PageToggle = 'NormalBuying' | 'Like';

const ToolBarButton = styled.button`
  flex: 2 1;
`;

const ShoppingListPage = ({ f7router }: PageRouteProps) => {
  // const [currentPrice, setCurrentPrice] = useState(0);
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [page, setPage] = useState<PageToggle>('NormalBuying');
  const [shoppingList, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);
  const likeList = useRecoilValue<Like>(likeListAtom);

  // const onSteppClickOrderCount = (value: number, id: string) => {
  //   console.log(id);
  //   const newShoppingList = shoppingList.map<IShoppingItem>((item) => {
  //     if (item.id === id) {
  //       return {
  //         ...item,
  //         orderCount: value,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });

  //   // const item = shoppingList.find((item) => item.id === id);

  //   // setCurrentPrice((prev) => prev + item.price);

  //   saveShoppingList(currentUser.id, newShoppingList);
  //   // setShoppingList([...newShoppingList]);
  // };

  // const onPlusOrderCount = (value: number, id: string) => {
  //   const item = shoppingList.find((item) => item.id === id);

  //   setCurrentPrice((prev) => prev + item.price);
  //   console.log(currentPrice);
  //   // plusTotalPrice(id);
  // };

  // const onMinusOrderCount = (e: any) => {
  //   const id = e.target.name;

  //   const item = shoppingList.find((item) => item.id === id);

  //   setCurrentPrice((prev) => prev - item.price);
  //   console.log(currentPrice);
  //   // plusTotalPrice(id);
  // };

  const changeToLike = () => {
    setPage('Like');
  };

  const changeToNormalBuying = () => {
    setPage('NormalBuying');
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      {/* <Toolbar top>
        <div></div>
        <Link href="/shopping-list" className="font-bold flex px-6 py-4 text-base border-b-2 border-blue-700">
          일반구매({shoppingList.length})
        </Link>
        <Link href="/like-list" className="font-bold flex px-6 py-4 text-base !text-black hover:text-blue-700">
          찜한상품({likeList.products.length})
        </Link>
        <div></div>
      </Toolbar> */}
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
      {page === 'NormalBuying' ? <NormalBuying f7router={f7router} /> : <div>Like</div>}
    </Page>
  );
};

export default React.memo(ShoppingListPage);
