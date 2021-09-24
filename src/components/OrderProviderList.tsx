import React from 'react';
import { f7 } from 'framework7-react';
import { UseMutationResult, useQuery, useQueryClient } from 'react-query';

import { getOrdersFromProviderAPI } from '@api';
import OrderItem from '@components/OrderItem';
import { ordersFromProvider } from '@reactQuery/query-keys';
import { CancelOrderItemInput, CancelOrderItemOutput } from '@interfaces/order.interface';
import { User } from '@interfaces/user.interface';

interface OrderProviderListProps {
  currentUser: User;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
}

const OrderProviderList: React.FC<OrderProviderListProps> = ({ currentUser, cancelOrderItemMutation }) => {
  const { data, status, refetch } = useQuery(ordersFromProvider.list({ providerId: currentUser.id }), () =>
    getOrdersFromProviderAPI({ providerId: currentUser.id }),
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
      {status === 'success' && data?.orderItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">주문 목록이 비었습니다.</span>
        </div>
      ) : (
        data?.orderItems.map((orderItem) => (
          <OrderItem
            key={orderItem.id}
            userId={currentUser.id}
            orderItem={orderItem}
            cancelOrderItemMutation={cancelOrderItemMutation}
            onSuccess={onSuccess}
            providerOrderListrefetch={refetch}
          />
        ))
      )}
    </>
  );
};

export default React.memo(OrderProviderList);
