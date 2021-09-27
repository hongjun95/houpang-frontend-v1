import React from 'react';
import { QueryObserverResult, RefetchOptions, UseMutationResult } from 'react-query';
import { f7 } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { Router } from 'framework7/types';

import { formmatPrice } from '@utils/index';
import { existedProductOnShoppingList, getShoppingList, IShoppingItem, saveShoppingList } from '@store';
import { shoppingListAtom } from '@atoms';
import {
  CancelOrderItemInput,
  CancelOrderItemOutput,
  GetOrdersFromProviderOutput,
  OrderItem,
  OrderStatus,
} from '@interfaces/order.interface';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@interfaces/user.interface';
import { updateOrderStatusAPI } from '@api';

interface OrderItemProps {
  userId: string;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
  onSuccess({ ok, error, orderItem }: { ok: any; error: any; orderItem: any }): void;
  providerOrderListrefetch?(
    options?: RefetchOptions,
  ): Promise<QueryObserverResult<GetOrdersFromProviderOutput, unknown>>;
  f7router?: Router.Router;
  orderItem: OrderItem;
}

const OrderItemComponent: React.FC<OrderItemProps> = ({
  userId,
  cancelOrderItemMutation,
  onSuccess,
  providerOrderListrefetch,
  f7router,
  orderItem,
}) => {
  const { currentUser } = useAuth();
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

  const onCancelOrderItemClick = async () => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      cancelOrderItemMutation.mutate(
        {
          orderItemId: orderItem.id,
        },
        {
          onSuccess,
        },
      );
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  const onExchangeOrReturnOrderItemClick = async () => {
    if (f7router) {
      f7router.navigate(`/orders/${orderItem.id}/refund/select-product`, {
        props: {
          orderItem,
        },
      });
    }
  };

  const onAcceptOrderClick = async () => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ok, error } = await updateOrderStatusAPI({
        orderItemId: orderItem.id,
        orderStatus: OrderStatus.Received,
      });
      if (ok) {
        f7.dialog.alert('주문을 수락하였습니다.');
        providerOrderListrefetch();
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  return (
    <div className="pb-2 border-b border-gray-400 mx-3 my-4">
      <div className="mb-4">
        <span className="font-bold text-md">{orderItem.status}</span>
      </div>
      <div className="flex">
        <a href={`/products/${orderItem.product.id}`}>
          <img src={orderItem.product.images[0]} alt="" className="w-24 h-24 mr-4" />
        </a>
        {/* <div
          style={{ backgroundImage: `url(${orderItem.product.images[0]})` }}
          className=" bg-gray-200 bg-center bg-cover w-24 h-24 mr-4"
        ></div> */}
        <div className="overflow-hidden w-3/4 flex flex-col justify-between h-full">
          <a href={`/products/${orderItem.product.id}`}>
            <div className="font-bold mb-4 line-clamp-2 h-10">{orderItem.product.name}</div>
          </a>
          <div className="flex justify-between items-center">
            <div className="flex text-gray-500 text-lg">
              <div>
                <span>{formmatPrice(orderItem.product.price)}</span>
                <span>원</span>
              </div>
              <span className="mx-1">&#183;</span>
              <span>{orderItem.count}개</span>
            </div>
            {currentUser.role === UserRole.Consumer ? (
              <button
                className={`w-1/2 py-2 px-3 rounded-md ml-2 ${
                  existedProductOnShoppingList(userId, orderItem.product.id)
                    ? 'border border-gray-600 text-gray-600 pointer-events-none'
                    : 'border-2 border-blue-600 text-blue-600'
                }`}
                onClick={(e) =>
                  onAddProductToShoppingList(e, {
                    id: orderItem.product.id,
                    name: orderItem.product.name,
                    price: orderItem.product.price,
                    orderCount: 1,
                    imageUrl: orderItem.product.images[0],
                  })
                }
                disabled={existedProductOnShoppingList(userId, orderItem.product.id)}
              >
                장바구니 담기
              </button>
            ) : (
              <button
                className={`w-1/2 py-2 px-3 rounded-md ml-2 ${
                  orderItem.status !== OrderStatus.Checking
                    ? 'border border-gray-600 text-gray-600 pointer-events-none'
                    : 'border-2 border-blue-600 text-blue-600'
                }`}
                onClick={onAcceptOrderClick}
                disabled={orderItem.status !== OrderStatus.Checking}
              >
                주문 수락
              </button>
            )}
          </div>
          <div className="flex items-center"></div>
        </div>
      </div>
      <div className="flex mt-2">
        {currentUser.role === UserRole.Consumer && orderItem.status === OrderStatus.Delivered ? (
          <button
            className="border-2 py-2 rounded-lg mr-2 border-gray-200 font-medium flex-1"
            onClick={onExchangeOrReturnOrderItemClick}
          >
            교환<span className="mx-1">&#183;</span>반품 신청
          </button>
        ) : orderItem.status === OrderStatus.Checking ? (
          <button
            className="border-2 py-2 rounded-lg mr-2 border-gray-200 font-medium flex-1"
            onClick={onCancelOrderItemClick}
          >
            주문<span className="mx-1">&#183;</span>배송 취소
          </button>
        ) : orderItem.status === OrderStatus.Canceled ? (
          <div className="border-2 py-2 rounded-lg mr-2 border-gray-200 flex-1 font-medium w-1/2 text-center text-gray-500">
            주문 취소 완료
          </div>
        ) : (
          <div className="border-2 py-2 rounded-lg mr-2 border-gray-200 flex-1 font-medium w-1/2 text-center text-gray-500">
            {orderItem.status}
          </div>
        )}
        <button className="border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-medium flex-1">배송조회</button>
      </div>
    </div>
  );
};

export default OrderItemComponent;
