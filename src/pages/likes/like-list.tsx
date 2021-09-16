import React, { useState } from 'react';
import { Checkbox, Link, Navbar, Page, Stepper, Toolbar } from 'framework7-react';

import { formmatPrice } from '@utils/index';
import { addProductToShoppingList, getShoppingList } from '@store';
import { PageRouteProps } from '@constants';
import useAuth from '@hooks/useAuth';
import { useRecoilState } from 'recoil';
import { Like } from '@interfaces/like.interface';
import { likeListAtom } from '@atoms';

const LikeListPage = ({ f7router }: PageRouteProps) => {
  const { currentUser } = useAuth();
  const shoppingList = getShoppingList(currentUser.id);
  const [likeList, setLikeList] = useRecoilState<Like>(likeListAtom);

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      <Toolbar top>
        <div></div>
        <Link href="/shopping-list" className="font-bold flex px-6 py-4 text-base !text-black hover:text-blue-700">
          일반구매({shoppingList.length})
        </Link>
        <Link href="/like-list" className="font-bold flex px-6 py-4 text-base border-b-2 border-blue-700">
          찜한상품({likeList.products.length})
        </Link>
        <div></div>
      </Toolbar>

      {/* <View id="view-shopping-list" stackPages name="items" tab url="/shopping-list" /> */}
      {/* <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" /> */}
      {likeList &&
        likeList.products.map((item) => (
          <div className="pb-2 border-b border-gray-400 mx-2 my-4" key={item.id}>
            <div className="flex">
              <img src={item.images[0]} alt="" className="w-1/4 mr-4" />
              <div className="w-full flex flex-col justify-between">
                <div className="flex mb-4">
                  <div className="font-bold">{item.name}</div>
                </div>
                <div className="mb-4">
                  <span className="font-bold text-lg">{formmatPrice(item.price)}</span>
                  <span>원</span>
                </div>
                <div className="flex items-center">
                  <button className="w-20 font-medium border py-2 px-4 rounded-md border-gray-300">삭제</button>
                  <button className="w-1/2 py-2 px-3 border-2 border-blue-600 text-blue-600 rounded-md ml-2">
                    장바구니 담기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </Page>
  );
};

export default React.memo(LikeListPage);
