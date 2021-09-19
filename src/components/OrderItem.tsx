import React, { memo } from 'react';

import { formmatPrice } from '@utils/index';
import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { useRecoilState } from 'recoil';
import { shoppingListAtom } from '@atoms';
import { f7 } from 'framework7-react';
import styled from 'styled-components';

interface OrderItemProps {
  orderItemId: string;
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
}

const OrderItemContent = styled.div`
  flex: 3 1;
`;

const OrderItem: React.FC<OrderItemProps> = ({
  orderItemId,
  productId,
  productName,
  productPrice = 1,
  productImage,
  userId,
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
    <div className="pb-2 border-b border-gray-400 mx-2 my-4" key={orderItemId}>
      <div className="flex">
        <img src={productImage} alt="" className="w-1/4 mr-4" />
        <OrderItemContent className="w-full flex flex-col justify-between">
          <div className="flex mb-4">
            <div className="font-bold">{productName}</div>
          </div>
          <div className="mb-4">
            <span className="font-bold text-lg">{formmatPrice(productPrice)}</span>
            <span>원</span>
          </div>
          <div className="flex items-center">
            <button
              className={`w-1/2 py-2 px-3   rounded-md ml-2 ${
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
        </OrderItemContent>
      </div>
    </div>
  );
};

export default OrderItem;
