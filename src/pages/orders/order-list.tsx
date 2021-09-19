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

  const orderDate = (date) => {
    console.log(typeof date);
    console.log(date);
    return date;
    // return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
    // return orderDate;
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="장바구니" backLink={true}></Navbar>
      {status === 'success' &&
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
                productId={orderItem?.product?.id}
                productImage={orderItem?.product?.images[0]}
                productName={orderItem?.product?.name}
                productPrice={orderItem?.product?.price}
                userId={currentUser.id}
              />
            ))}
          </Order>
        ))}
    </Page>
  );
};

export default React.memo(OrderListPage);
