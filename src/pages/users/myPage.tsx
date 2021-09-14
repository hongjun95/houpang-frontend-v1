import { API_URL } from '@api';
import useAuth from '@hooks/useAuth';
import { UserRole } from '@interfaces/user.interface';
import { Navbar, NavTitle, Page } from 'framework7-react';
import React, { useCallback } from 'react';

const MyPage = () => {
  const { currentUser, isAuthenticated, unAuthenticateUser } = useAuth();

  const logoutHandler = useCallback(async () => {
    unAuthenticateUser();
  }, [unAuthenticateUser]);

  return (
    <Page name="mypage">
      <Navbar>
        <NavTitle>마이페이지</NavTitle>
      </Navbar>
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <a href={`/users/${currentUser?.id}`}>
                <div className="relative">
                  {currentUser?.username ? (
                    <img className="h-24 w-24 rounded-full" src={API_URL + currentUser?.username} alt="" />
                  ) : (
                    <i
                      className="h-24 w-24 rounded-full las la-user-circle"
                      style={{ fontSize: '96px', color: 'gray' }}
                    />
                  )}
                  <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true" />
                </div>
              </a>
            </div>
            <div className="w-full">
              <a href={`/users/${currentUser?.id}`}>
                <h1 className="text-xl font-bold text-gray-900">
                  {isAuthenticated ? currentUser.username : '인썸니아'}
                </h1>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  팔로워 <span className=" text-gray-900">0</span> | 팔로잉 <span className=" text-gray-900">0</span>
                </p>
              </a>
            </div>
            <a href={`/users/${currentUser?.id}`}>
              <i className="las la-angle-right" style={{ fontSize: '24px', color: 'gray' }} />
            </a>
          </div>
        </div>
        <div className="py-8 grid grid-flow-col auto-cols-max grid-cols-3 gap-4 text-center">
          <div className="text-center">
            <a href="/notifications">
              <i className="mb-2 las la-bell" style={{ fontSize: '42px', color: 'lightgray' }} />
              <br />
              <span className="text-sm text-gray-600">알림</span>
            </a>
          </div>
          <div className="text-center">
            <i className="mb-2 las la-file-invoice" style={{ fontSize: '42px', color: 'lightgray' }} />
            <br />
            <span className="text-sm text-gray-600">주문</span>
          </div>
          <div className="text-center">
            <a href="/likes/list" className="text-sm text-gray-600">
              <i className="mb-2 lar la-heart" style={{ fontSize: '42px', color: 'lightgray' }} />
              <br />
              좋아요{/* <span className="font-semibold text-gray-900">0</span> */}
            </a>
          </div>
        </div>
        <div className="bg-white overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {currentUser.role === UserRole.Provider && (
              <li>
                <a href="/products/add" className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">상품 추가하기</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            )}
            <li>
              <a href="/users/edit-profile" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">회원 정보 수정</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="/users/change-password" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">비밀 번호 변경</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">주문/배송 조회</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">교환/환불 조회</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">리뷰</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">고객센터</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">신고하기</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </li>
            {isAuthenticated ? (
              <li>
                <a href="#" onClick={logoutHandler} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-400 truncate">로그아웃</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <footer className="bg-gray-100 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-xs text-gray-400">
              <a href="#">이용약관 </a> | <a href="#">개인정보처리방침</a>
            </p>

            <p className="mt-2 text-xs text-gray-400">&copy; 2021 insomenia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Page>
  );
};

export default React.memo(MyPage);
