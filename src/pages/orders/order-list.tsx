import React from 'react';
import { Navbar, Page } from 'framework7-react';

import useAuth from '@hooks/useAuth';
import { getOrdersFromConsumerAPI } from '@api';
import OrderItem from '@components/OrderItem';
import Order from '@components/Order';
import { useQuery } from 'react-query';
import { ordersFromConsumer } from '@reactQuery/query-keys';

const OrderListPage = () => {
  const { currentUser } = useAuth();

  const { data, status } = useQuery(ordersFromConsumer.list({ consumerId: currentUser.id }), () =>
    getOrdersFromConsumerAPI({ consumerId: currentUser.id }),
  );

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="주문목록" backLink={true}></Navbar>
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
                orderId={order.id}
                orderItemStatus={orderItem.status}
                productId={orderItem?.product?.id}
                productImage={orderItem?.product?.images[0]}
                productName={orderItem?.product?.name}
                productPrice={orderItem?.product?.price}
                productCount={orderItem.count}
                userId={currentUser.id}
              />
            ))}
          </Order>
        ))
      )}
    </Page>
  );
};

export default React.memo(OrderListPage);
