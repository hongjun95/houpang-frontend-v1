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

  const [items, setItems] = useState([]);
  const onItemChange = (e) => {
    const name = e.target.name;

    if (e.target.checked) {
      items.push(name);
    } else {
      items.splice(items.indexOf(name), 1);
    }
    setItems([...items]);
  };
  const onItemsChange = () => {
    if (items.length === 1 || items.length === 0) {
      const checkedNames = shoppingList.map((item) => `item-${item.id}`);
      setItems(checkedNames);
    } else if (items.length === shoppingList.length) {
      setItems([]);
    }
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
                  <Checkbox
                    name={`item-${item.id}`}
                    className="mr-2"
                    checked={items.indexOf(`item-${item.id}`) >= 0}
                    onChange={onItemChange}
                  ></Checkbox>
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
        <Checkbox
          name="buy-all"
          className="mr-2"
          checked={items.length === shoppingList.length}
          onChange={onItemsChange}
        ></Checkbox>
        <div>Price</div>
        <button
          className="border mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
          data-actions="#buy"
        >
          구매하기
        </button>
      </div>
    </Page>
  );
};

export default React.memo(ShoppingListPage);
