import React from 'react';
import { f7 } from 'framework7-react';

import { getOrdersFromConsumerAPI } from '@api';
import OrderItem from '@components/OrderItem';
import Order from '@components/Order';
import { UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { ordersFromConsumer } from '@reactQuery/query-keys';
import { CancelOrderItemInput, CancelOrderItemOutput } from '@interfaces/order.interface';
import { User } from '@interfaces/user.interface';

interface OrderConsumerListProps {
  currentUser: User;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
}

const OrderConsumerList: React.FC<OrderConsumerListProps> = ({ currentUser, cancelOrderItemMutation }) => {
  const { data, status, refetch } = useQuery(ordersFromConsumer.list({ consumerId: currentUser.id }), () =>
    getOrdersFromConsumerAPI({ consumerId: currentUser.id }),
  );

  const queryClient = useQueryClient();
  const onSuccess = ({ ok, error, orderItem }) => {
    if (ok) {
      f7.dialog.alert('주문을 취소했습니다.');
      queryClient.setQueryData(['cancelOrderItem'], orderItem);
      refetch();
    } else {
      f7.dialog.alert(error);
    }
  };

  return (
    <>
      {status === 'success' && data.orders.length === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">주문 목록이 비었습니다.</span>
        </div>
      ) : (
        data?.orders.map((order) => (
          <Order
            key={order.id}
            createdAt={order.orderedAt}
            destination={order.destination}
            deliverRequest={order.deliverRequest}
          >
            {order?.orderItems?.map((orderItem) => (
              <OrderItem
                key={orderItem.id}
                orderItemId={orderItem.id}
                orderItemStatus={orderItem.status}
                productId={orderItem?.product?.id}
                productImage={orderItem?.product?.images[0]}
                productName={orderItem?.product?.name}
                productPrice={orderItem?.product?.price}
                productCount={orderItem.count}
                userId={currentUser.id}
                cancelOrderItemMutation={cancelOrderItemMutation}
                onSuccess={onSuccess}
              />
            ))}
          </Order>
        ))
      )}
    </>
  );
};

export default React.memo(OrderConsumerList);
