import React, { useState } from 'react';
import {
  Actions,
  ActionsButton,
  ActionsGroup,
  ActionsLabel,
  Checkbox,
  Link,
  Navbar,
  Page,
  Stepper,
  Swiper,
  SwiperSlide,
  Toolbar,
  View,
  Views,
} from 'framework7-react';
import { useQuery } from 'react-query';

import { FindProductByIdOutput } from '@interfaces/product.interface';
import { productKeys } from '@reactQuery/query-keys';
import { findProductById } from '@api';
import { formmatPrice } from '@utils/index';
import LandingPage from '@pages/landing';
import { addProductToShoppingList, getShoppingList } from '@store';

interface IOrderCount {
  id: string;
  count: number;
}

const ShoppingListPage = ({ f7route }) => {
  const shoppingList = getShoppingList();

  const onClickOrderCount = (e, id: string) => {
    shoppingList.forEach((item) => {
      if (item.id == id) {
        item.orderCount = e;
      }
    });
    addProductToShoppingList(shoppingList);
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      <Toolbar top>
        {/* <Link tabLink="#view-shopping-list" tabLinkActive icon="las la-home" text="일반구매" /> */}
        {/* <Link tabLink="#view-users" icon="las la-address-book" text="찜한상품" /> */}
        <Link href="/" className="font-bold flex px-6 py-4 text-base">
          일반구매
        </Link>
      </Toolbar>

      {/* <View id="view-shopping-list" stackPages name="items" tab url="/shopping-list" /> */}
      {/* <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" /> */}
      {shoppingList &&
        shoppingList.map((item) => (
          <div className="pb-2 border-b border-gray-400 mx-2 my-4" key={item.id}>
            <div className="flex">
              <img src={item.imageUrl} alt="" className="w-1/4 mr-4" />
              <div>
                <div className="flex mb-4">
                  <Checkbox name={`item-${item.id}`} className="mr-2"></Checkbox>
                  <div className="font-bold">{item.name}</div>
                </div>
                <div className="mb-4">
                  <span className="font-bold text-lg">{formmatPrice(item.price)}</span>
                  <span>원</span>
                </div>
                <div className="flex items-center">
                  <button className="w-20 font-medium border py-2 px-6 rounded-md bg-gray-200">삭제</button>
                  <Stepper
                    value={item.orderCount}
                    onStepperChange={(e) => onClickOrderCount(e, item.id)}
                    className="ml-4 text-gray-300 border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

      <div className="flex fixed bottom-2 border-t-2 botder-gray-600 w-full p-2 bg-white">
        <i className="f7-icons m-3 text-gray-500">heart</i>
        <button
          className="border mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
          data-actions="#buy"
        >
          구매하기
        </button>
      </div>
      <Actions id="buy">
        <ActionsGroup>
          <ActionsLabel>옵션 선택</ActionsLabel>
          <ActionsButton bold>Button 1</ActionsButton>
          <ActionsButton>Button 2</ActionsButton>
          <ActionsButton color="red">Cancel</ActionsButton>
        </ActionsGroup>
      </Actions>
    </Page>
  );
};

export default React.memo(ShoppingListPage);
