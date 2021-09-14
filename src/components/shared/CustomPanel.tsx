import React from 'react';
import { Link, List, Navbar, Page, PageContent, Panel } from 'framework7-react';

const CustomPanel = ({ currentUser, handleLogout, isLoggedIn }) => {
  return (
    <Panel left cover className="shadow">
      <Page>
        <Navbar title="메뉴" />
        <PageContent>
          <a href="#" className="mb-8 my-2 mx-2 px-3 flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <i className="las la-user-circle" style={{ fontSize: '64px', color: '#374151' }} />
              </div>
              <div className="ml-3">
                <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
                  {isLoggedIn ? currentUser.username : '인썸니아'}
                </p>
                <p
                  className="text-sm font-normal text-gray-500 group-hover:text-gray-700"
                  style={{ overflowWrap: 'anywhere' }}
                >
                  {isLoggedIn ? currentUser.email : 'test@insomenia'}
                </p>
              </div>
            </div>
          </a>
          <List className="mt-0">
            <Link
              href="/notices"
              className="flex justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-50 group px-6 py-4 text-base font-medium rounded-md"
              panelClose
            >
              <i className="las la-calendar-check mr-4" style={{ fontSize: '28px', color: '#374151' }} />
              공지사항
            </Link>
            <Link
              href="/faqs"
              className="flex justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-50 group px-6 py-4 text-base font-medium rounded-md"
              panelClose
            >
              <i className="las la-question-circle mr-4" style={{ fontSize: '28px', color: '#374151' }} />
              FAQ
            </Link>
            <Link
              href="/posts"
              className="flex justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-50 group px-6 py-4 text-base font-medium rounded-md"
              panelClose
            >
              <i className="las la-edit mr-4" style={{ fontSize: '28px', color: '#374151' }} />
              게시글
            </Link>
            <Link
              href="/shopping-list"
              className="flex justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-50 group px-6 py-4 text-base font-medium rounded-md"
              panelClose
            >
              <i className="las la-shopping-cart mr-4" style={{ fontSize: '28px', color: '#374151' }} />
              장바구니
            </Link>
            {isLoggedIn ? (
              <Link
                onClick={handleLogout}
                className="flex justify-start text-gray-900 hover:text-gray-900 hover:bg-gray-50 group px-6 py-4 text-base font-medium rounded-md"
                panelClose
              >
                <i className="las la-sign-out-alt mr-4" style={{ fontSize: '28px', color: '#374151' }} />
                로그아웃
              </Link>
            ) : null}
          </List>
        </PageContent>
      </Page>
    </Panel>
  );
};

export default React.memo(CustomPanel);
