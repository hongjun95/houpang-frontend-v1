import React, { useEffect } from 'react';
import { f7 } from 'framework7-react';
import { useInfiniteQuery, UseMutationResult, useQueryClient } from 'react-query';

import { getOrdersFromProviderAPI } from '@api';
import OrderItem from '@components/OrderItem';
import { ordersFromProvider } from '@reactQuery/query-keys';
import { CancelOrderItemInput, CancelOrderItemOutput, GetOrdersFromProviderOutput } from '@interfaces/order.interface';
import { User } from '@interfaces/user.interface';
import { useInView } from 'react-intersection-observer';
import LandingPage from '@pages/landing';

interface OrderProviderListProps {
  currentUser: User;
  cancelOrderItemMutation: UseMutationResult<CancelOrderItemOutput, Error, CancelOrderItemInput, CancelOrderItemOutput>;
}

const OrderProviderList: React.FC<OrderProviderListProps> = ({ currentUser, cancelOrderItemMutation }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const {
    fetchNextPage, //
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
  } = useInfiniteQuery<GetOrdersFromProviderOutput, Error>(
    ordersFromProvider.list({ providerId: currentUser.id }),
    ({ pageParam }) =>
      getOrdersFromProviderAPI({
        providerId: currentUser.id,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching]);

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
      {status === 'error' ? (
        <div>Error:{error.message}</div>
      ) : status === 'loading' ? (
        <LandingPage />
      ) : status === 'success' && data?.pages[0].totalResults === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">주문 목록이 비었습니다.</span>
        </div>
      ) : (
        <ul className="flex flex-col">
          {data.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page?.orderItems.map((orderItem) => (
                <OrderItem
                  key={orderItem.id}
                  userId={currentUser.id}
                  orderItem={orderItem}
                  cancelOrderItemMutation={cancelOrderItemMutation}
                  onSuccess={onSuccess}
                  providerOrderListrefetch={refetch}
                  isOnMyOrders={false}
                />
              ))}
            </React.Fragment>
          ))}
        </ul>
      )}
      <div className="flex justify-center font-bold mt-4">
        <div ref={hasNextPage && !isFetching ? ref : null}>
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
        </div>
      </div>
    </>
  );
};

export default React.memo(OrderProviderList);
