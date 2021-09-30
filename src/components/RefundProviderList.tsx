import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Router } from 'framework7/types';
import { useInView } from 'react-intersection-observer';

import { getRefundsFromProviderAPI } from '@api';
import { refundsFromProvider } from '@reactQuery/query-keys';
import { User } from '@interfaces/user.interface';
import RefundItem from './RefundItem';
import { GetRefundsFromProviderOutput, Refund } from '@interfaces/refund.interface';
import LandingPage from '@pages/landing';

interface RefundProviderListProps {
  currentUser: User;
  f7router: Router.Router;
}

const RefundProviderList: React.FC<RefundProviderListProps> = ({ currentUser }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const {
    fetchNextPage, //
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
  } = useInfiniteQuery<GetRefundsFromProviderOutput, Error>(
    refundsFromProvider.list({ providerId: currentUser.id, page: 1 }),
    ({ pageParam }) => getRefundsFromProviderAPI({ providerId: currentUser.id, page: pageParam }),
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

  return (
    <>
      {status === 'loading' ? (
        <LandingPage />
      ) : status === 'error' ? (
        <span>Error : {error.message}</span>
      ) : data?.pages[0].refundItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">취소&#183;반품&#183;교환 목록이 비었습니다.</span>
        </div>
      ) : (
        <div>
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.refundItems.map((refundItem: Refund) => (
                <RefundItem key={refundItem.id} userId={currentUser.id} refundItem={refundItem} isProviderList={true} />
              ))}
            </React.Fragment>
          ))}
          <div className="flex justify-center font-bold mt-4">
            <div ref={hasNextPage && !isFetching ? ref : null}>
              {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(RefundProviderList);
