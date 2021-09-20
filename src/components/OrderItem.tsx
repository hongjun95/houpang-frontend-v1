import React from 'react';
import { UseMutationResult } from 'react-query';
import { f7 } from 'framework7-react';
import { useRecoilState } from 'recoil';

import { formmatPrice } from '@utils/index';
import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { shoppingListAtom } from '@atoms';
import { CancelOrderItemInput, CancelOrderItemOutput, OrderStatus } from '@interfaces/order.interface';

interface OrderItemProps {
  userId: string;
  orderId: string;
  orderItemId: string;
  orderItemStatus: OrderStatus;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCount: number;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
}

const OrderItem: React.FC<OrderItemProps> = ({
  userId,
  orderId,
  orderItemId,
  orderItemStatus,
  productId,
  productName,
  productPrice,
  productImage,
  productCount,
  cancelOrderItemMutation,
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

  const onCancelOrderItemClick = async () => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      cancelOrderItemMutation.mutate({
        orderId,
        orderItemId,
      });

      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  return (
    <div className="pb-2 border-b border-gray-400 mx-3 my-4">
      <div className="mb-4">
        <span className="font-bold text-md">{orderItemStatus}</span>
      </div>
      <div className="flex">
        <img src={productImage} alt="" className="w-24 h-24 mr-4" />
        {/* <div
          style={{ backgroundImage: `url(${productImage})` }}
          className=" bg-gray-200 bg-center bg-cover w-24 h-24 mr-4"
        ></div> */}
        <div className="overflow-hidden w-3/4 flex flex-col justify-between h-full">
          <div className="font-bold mb-4 h-12 truncate">{productName}</div>
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
        </div>
      </div>
      <div className="flex mt-2">
        {orderItemStatus === OrderStatus.Canceled ? (
          <div className="border-2 py-2 rounded-lg mr-2 border-gray-200 flex-1 font-medium w-1/2 text-center text-gray-500">
            주문 취소 완료
          </div>
        ) : (
          <button
            className="border-2 py-2 rounded-lg mr-2 border-gray-200 font-medium flex-1"
            onClick={onCancelOrderItemClick}
          >
            주문<span className="mx-1">&#183;</span>배송 취소
          </button>
        )}
        <button className="border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-medium flex-1">배송조회</button>
      </div>
    </div>
  );
};

export default OrderItem;
