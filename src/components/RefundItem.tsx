import React from 'react';
import { f7 } from 'framework7-react';
import { useRecoilState } from 'recoil';

import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { shoppingListAtom } from '@atoms';
import { Refund } from '@interfaces/refund.interface';

interface RefundItemProps {
  userId: string;
  refundItem: Refund;
}

const RefundItemComponent: React.FC<RefundItemProps> = ({ userId, refundItem }) => {
  const [, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);

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
    <div className="border border-gray-400 mx-3 my-4">
      <div className="mb-4 bg-gray-200 p-2">{refundItem.refundedAt}</div>
      <div className="p-2">
        <div className="font-bold mb-4 truncate">{refundItem.orderItem.product.name}</div>
        <div className="flex justify-between">
          <div>
            <span className="text-red-500 font-semibold mr-1">{refundItem.status}완료</span>
            <span>
              {refundItem.refundedAt}
              {refundItem.status} 접수
            </span>
          </div>
          <button
            className={`w-1/3 py-2 px-3 rounded-md ml-2 ${
              existedProductOnShoppingList(userId, refundItem.orderItem.product.id)
                ? 'border border-gray-600 text-gray-600 pointer-events-none'
                : 'border-2 border-blue-600 text-blue-600'
            }`}
            onClick={(e) =>
              onAddProductToShoppingList(e, {
                id: refundItem.orderItem.product.id,
                name: refundItem.orderItem.product.name,
                price: refundItem.orderItem.product.price,
                orderCount: 1,
                imageUrl: refundItem.orderItem.product.images[0],
              })
            }
            disabled={existedProductOnShoppingList(userId, refundItem.orderItem.product.id)}
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundItemComponent;
