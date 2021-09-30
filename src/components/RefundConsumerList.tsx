import React from 'react';
import { useQuery } from 'react-query';
import { Router } from 'framework7/types';

import { getRefundsFromConsumerAPI } from '@api';
import { refundsFromConsumer } from '@reactQuery/query-keys';
import { User } from '@interfaces/user.interface';
import RefundItem from './RefundItem';

interface RefundConsumerListProps {
  currentUser: User;
  f7router: Router.Router;
}

const RefundConsumerList: React.FC<RefundConsumerListProps> = ({ currentUser }) => {
  const { data, status } = useQuery(refundsFromConsumer.list({ consumerId: currentUser.id }), () =>
    getRefundsFromConsumerAPI({ consumerId: currentUser.id }),
  );

  return (
    <>
      {status === 'success' && data?.refundItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-full">
          <span className="text-3xl font-bold text-gray-500">취소&#183;반품&#183;교환 목록이 비었습니다.</span>
        </div>
      ) : (
        data?.refundItems.map((refundItem) => (
          <RefundItem key={refundItem.id} userId={currentUser.id} refundItem={refundItem} isProviderList={false}/>
        ))
      )}
    </>
  );
};

export default React.memo(RefundConsumerList);
