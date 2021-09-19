import React from 'react';

import { formmatPrice } from '@utils/index';
import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { useRecoilState } from 'recoil';
import { shoppingListAtom } from '@atoms';
import { f7 } from 'framework7-react';
import styled from 'styled-components';
import { OrderStatus } from '@interfaces/order.interface';

interface OrderItemProps {
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  orderStatus: OrderStatus;
  productCount: number;
}

const OrderItemContent = styled.div`
  // flex: 3 1;
`;

const OrderItem: React.FC<OrderItemProps> = ({
  orderStatus,
  productId,
  productName,
  productPrice = 1,
  productImage,
  userId,
  productCount,
}) => {
  const [shoppingList, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const onAddProductToShoppingList = (e: any, data: IShoppingItem) => {
    const shoppingList = getShoppingList(userId);
    if (existedProductOnShoppingList(userId, data.id)) {
      f7.dialog.alert('이미 장바구니에 있습니다.');
    } else {
      f7.dialog.alert('장바구니에 담았습니다.');
      const shoppingItem: IShoppingItem = {
        id: data.id,
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        orderCount: 1,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(userId, shoppingList);
      setShoppingList([...shoppingList]);
    }
  };
  return (
    <div className="pb-2 border-b border-gray-400 mx-3 my-4">
      <div className="mb-4">
        <span className="font-bold text-md">{orderStatus}</span>
      </div>
      <div className="flex">
        {/* <img src={productImage} alt="" className="w-1/4 h-24 mr-4" /> */}
        <div
          style={{ backgroundImage: `url(${productImage})` }}
          className=" bg-gray-200 bg-center bg-cover w-24 h-24 mr-4"
        ></div>
        <OrderItemContent className="overflow-hidden w-3/4 flex flex-col justify-between h-full">
          <div className="font-bold mb-4 h-12 truncate">{productName}</div>
          {/* <div className="h-6"></div> */}
          <div className="flex justify-between items-center">
            <div className="flex text-gray-500 text-lg">
              <div>
                <span>{formmatPrice(productPrice)}</span>
                <span>원</span>
              </div>
              <span className="mx-1">&#183;</span>
              <span>{productCount}개</span>
            </div>
            <button
              className={`w-1/2 py-2 px-3 rounded-md ml-2 ${
                existedProductOnShoppingList(userId, productId)
                  ? 'border border-gray-600 text-gray-600 pointer-events-none'
                  : 'border-2 border-blue-600 text-blue-600'
              }`}
              onClick={(e) =>
                onAddProductToShoppingList(e, {
                  id: productId,
                  name: productName,
                  price: productPrice,
                  orderCount: 1,
                  imageUrl: productImage,
                })
              }
              disabled={existedProductOnShoppingList(userId, productId)}
            >
              장바구니 담기
            </button>
          </div>
          <div className="flex items-center"></div>
        </OrderItemContent>
      </div>
      <div className="flex mt-2">
        <button className="border-2 py-2 rounded-lg mr-2 border-gray-200 font-medium">
          주문<span className="mx-1">&#183;</span>배송 취소
        </button>
        <button className="border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-medium">배송조회</button>
      </div>
    </div>
  );
};

export default OrderItem;
