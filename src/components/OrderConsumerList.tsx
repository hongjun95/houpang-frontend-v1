import React from 'react';
import { f7 } from 'framework7-react';
import { UseMutationResult, useQuery, useQueryClient } from 'react-query';
import { Router } from 'framework7/types';

import { getOrdersFromConsumerAPI } from '@api';
import Order from '@components/Order';
import { ordersFromConsumer } from '@reactQuery/query-keys';
import { CancelOrderItemInput, CancelOrderItemOutput } from '@interfaces/order.interface';
import { User } from '@interfaces/user.interface';
import OrderItemComponent from '@components/OrderItem';

interface OrderConsumerListProps {
  currentUser: User;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
  f7router: Router.Router;
}

const OrderConsumerList: React.FC<OrderConsumerListProps> = ({ currentUser, cancelOrderItemMutation, f7router }) => {
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
              <OrderItemComponent
                key={orderItem.id}
                userId={currentUser.id}
                orderItem={orderItem}
                cancelOrderItemMutation={cancelOrderItemMutation}
                onSuccess={onSuccess}
                f7router={f7router}
              />
            ))}
          </Order>
        ))
      )}
    </>
  );
};

export default React.memo(OrderConsumerList);
