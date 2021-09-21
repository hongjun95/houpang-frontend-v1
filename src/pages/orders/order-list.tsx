import React, { useState } from 'react';
import { Navbar, Page } from 'framework7-react';
import styled from 'styled-components';

import useAuth from '@hooks/useAuth';
import { cancelOrderItemAPI } from '@api';
import { useMutation } from 'react-query';
import { CancelOrderItemInput, CancelOrderItemOutput } from '@interfaces/order.interface';
import OrderConsumerList from '@components/OrderConsumerList';
import OrderProviderList from '@components/OrderProviderList';

type PageToggle = 'ConsumerOrders' | 'ProviderOrders';

const ToggleButton = styled.button`
  :nth-child(1).current_page ~ .indicator {
    transform: translateX(calc(0%));
  }
  :nth-child(2).current_page ~ .indicator {
    transform: translateX(calc(100%));
  }
`;
const Indicator = styled.div`
  height: 1px;
  transition: 0.3s;
`;

const OrderListPage = () => {
  const { currentUser } = useAuth();
  const [page, setPage] = useState<PageToggle>('ConsumerOrders');

  const cancelOrderItemMutation = useMutation<
    CancelOrderItemOutput,
    Error,
    CancelOrderItemInput,
    CancelOrderItemOutput
  >(cancelOrderItemAPI);

  const changeToProviderOrders = () => {
    setPage('ProviderOrders');
  };

  const changeToConsumerOrders = () => {
    setPage('ConsumerOrders');
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="주문목록" backLink={true}></Navbar>

      <div className="flex w-full relative">
        <ToggleButton
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'ConsumerOrders' ? 'text-blue-700  py-4 current_page' : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToConsumerOrders}
        >
          <span className="">나의 주문</span>
        </ToggleButton>
        <ToggleButton
          className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
            page === 'ProviderOrders' ? 'text-blue-700 py-4 current_page' : '!text-black hover:text-blue-700'
          }  `}
          onClick={changeToProviderOrders}
        >
          <span>고객 주문</span>
        </ToggleButton>
        <Indicator className="indicator absolute left-0 bottom-0 w-1/2 bg-blue-700"></Indicator>
      </div>
      {page === 'ConsumerOrders' ? (
        <OrderConsumerList currentUser={currentUser} cancelOrderItemMutation={cancelOrderItemMutation} />
      ) : (
        <OrderProviderList currentUser={currentUser} cancelOrderItemMutation={cancelOrderItemMutation} />
      )}
    </Page>
  );
};

export default React.memo(OrderListPage);
