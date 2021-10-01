import React, { useState } from 'react';
import { Navbar, Page } from 'framework7-react';
import styled from 'styled-components';

import useAuth from '@hooks/useAuth';
import RefundConsumerList from '@components/RefundConsumerList';
import RefundProviderList from '@components/RefundProviderList';
import { UserRole } from '@interfaces/user.interface';
import { PageRouteProps } from '@constants';

type PageToggle = 'ConsumerRefunds' | 'ProviderRefunds';

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

const RefundListPage = ({ f7router }: PageRouteProps) => {
  const { currentUser } = useAuth();
  const [page, setPage] = useState<PageToggle>('ConsumerRefunds');

  const changeToProviderRefunds = () => {
    setPage('ProviderRefunds');
  };

  const changeToConsumerRefunds = () => {
    setPage('ConsumerRefunds');
  };

  const entityToChar = (str) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };
  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title={entityToChar(`취소&#183;반품&#183;교환목록`)} backLink={true}></Navbar>

      {currentUser.role !== UserRole.Consumer && (
        <div className="flex w-full fixed bg-white">
          <ToggleButton
            className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
              page === 'ConsumerRefunds' ? 'text-blue-700  py-4 current_page' : '!text-black hover:text-blue-700'
            }  `}
            onClick={changeToConsumerRefunds}
          >
            <span className="">나의 취소&#183;반품&#183;교환목록</span>
          </ToggleButton>
          <ToggleButton
            className={`outline-none flex items-center justify-center font-bold px-6 text-base ${
              page === 'ProviderRefunds' ? 'text-blue-700 py-4 current_page' : '!text-black hover:text-blue-700'
            }  `}
            onClick={changeToProviderRefunds}
          >
            <span>고객 취소&#183;반품&#183;교환목록</span>
          </ToggleButton>
          <Indicator className="indicator absolute left-0 bottom-0 w-1/2 bg-blue-700"></Indicator>
        </div>
      )}
      <div className={`${currentUser.role === UserRole.Provider ? 'pt-20' : ''} `}>
        {page === 'ConsumerRefunds' ? (
          <RefundConsumerList //
            currentUser={currentUser}
            f7router={f7router}
          />
        ) : (
          <RefundProviderList //
            currentUser={currentUser}
            f7router={f7router}
          />
        )}
      </div>
    </Page>
  );
};

export default React.memo(RefundListPage);
