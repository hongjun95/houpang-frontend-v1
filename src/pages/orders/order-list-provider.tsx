import React from 'react';
import { f7, Link, Navbar, Page, Toolbar } from 'framework7-react';

import useAuth from '@hooks/useAuth';
import { cancelOrderItemAPI, getOrdersFromProviderAPI } from '@api';
import OrderItem from '@components/OrderItem';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ordersFromProvider } from '@reactQuery/query-keys';
import { CancelOrderItemInput, CancelOrderItemOutput } from '@interfaces/order.interface';
import { UserRole } from '@interfaces/user.interface';

const OrderListProviderPage = () => {
  const { currentUser } = useAuth();

  const { data, status, refetch } = useQuery(ordersFromProvider.list({ providerId: currentUser.id }), () =>
    getOrdersFromProviderAPI({ providerId: currentUser.id }),
  );

  const queryClient = useQueryClient();
  const cancelOrderItemMutation = useMutation<
    CancelOrderItemOutput,
    Error,
    CancelOrderItemInput,
    CancelOrderItemOutput
  >(cancelOrderItemAPI, {
    onSuccess: ({ ok, error, orderItem }) => {
      if (ok) {
        f7.dialog.alert('주문을 취소했습니다.');
        queryClient.setQueryData(['cancelOrderItem'], orderItem);
        refetch();
      } else {
        f7.dialog.alert(error);
      }
    },
  });

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="주문목록" backLink={true}></Navbar>
      {currentUser.role === UserRole.Provider && (
        <Toolbar top>
          <div></div>
          <Link href="/order-list" className="font-bold flex px-6 py-4 text-base !text-black hover:text-blue-700">
            나의 주문
          </Link>
          <Link href="/order-list/provider" className="font-bold flex px-6 py-4 text-base border-b-2 border-blue-700">
            고객 주문
          </Link>
          <div></div>
        </Toolbar>
      )}
      {status === 'success' && data?.orderItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">주문 목록이 비었습니다.</span>
        </div>
      ) : (
        data?.orderItems.map((orderItem) => (
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
          />
        ))
      )}
    </Page>
  );
};

export default React.memo(OrderListProviderPage);
