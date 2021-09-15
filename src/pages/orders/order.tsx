import React from 'react';
import { Navbar, Page } from 'framework7-react';
import useAuth from '@hooks/useAuth';
import { getShoppingList } from '@store';
import { DELIVERY_FEE, PageRouteProps } from '@constants';
import { formmatPrice } from '@utils/index';

interface OrderProps extends PageRouteProps {
  items: string[];
  totalPrice: number;
}

const Order = ({ items, totalPrice }: OrderProps) => {
  const { currentUser } = useAuth();
  const shoppingList = getShoppingList();
  const orderList = shoppingList.filter((item) => items.includes(item.id));
  console.log(orderList);
  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="주문/결제" backLink={true}></Navbar>
      <div className="flex flex-col m-2">
        <div className="flex flex-col">
          <section className="order_section">
            <h3 className="font-bold text-black">
              <span className="pr-1 mr-1 border-r-2 border-gray-300">배송지</span>
              <span>{currentUser.username}</span>
            </h3>
            <div>주소 : {currentUser.address}</div>
            <div>휴대폰 : {currentUser.phoneNumber}</div>
          </section>
          <section className="order_section">
            <h3 className="font-bold text-black">배송 요청사항</h3>
            <textarea
              className="border resize-none outline-none w-full h-20 border-gray-300 p-2"
              name="deliver_request"
              placeholder="배송 요청사항"
            />
          </section>
        </div>
        <div className="flex flex-col mt-4">
          <h2 className="font-bold text-lg mb-2">배송 내용</h2>
          <section className="order_items">
            {orderList &&
              orderList.map((orderItem, index) => (
                <div
                  className={`text-gray-500   ${index !== orderList.length - 1 ? 'border-b-2 pb-2 mb-2' : ''}`}
                  key={orderItem.id}
                >
                  <h3 className="text-gray-900 mb-2 font-semibold">{orderItem.name}</h3>
                  <div className="">
                    <span>수량 {orderItem.orderCount}개 / </span>
                    <span>배송비</span>
                  </div>
                  <div>{formmatPrice(totalPrice)}원</div>
                </div>
              ))}
          </section>
        </div>

        <div className="flex flex-col mt-4">
          <section className="border border-gray-200 px-3 py-4 rounded-sm mb-2">
            <h2 className="font-bold text-lg mb-2 text-black">최종결제금액</h2>
            <div className="m-4">
              <div className="flex justify-between mb-4">
                <div>총 상품가격</div>
                <div>{formmatPrice(totalPrice)}원</div>
              </div>
              <div className="flex justify-between pb-4 border-b border-gray-400 mb-4">
                <div>배송비</div>
                <div>{formmatPrice(DELIVERY_FEE)}원</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">총 결제 금액</div>
                <div className="font-bold text-xl">{formmatPrice(totalPrice + DELIVERY_FEE)}원</div>
              </div>
            </div>
          </section>
        </div>
        <div className="m-2 text-gray-700">
          <div className="flex justify-between mb-4">
            <div>구매조건 확인 및 결제대행 서비스 약관 동의</div>
            <div>보기</div>
          </div>
          <div className="flex justify-between mb-4">
            <div>개인정보 제공안내</div>
            <div>보기</div>
          </div>
          <div className="text-xs pb-2 mb-2 border-b border-gray-400">
            <p>
              * 개별 판매자가 등록한 마켓플레이스(오픈마켓) 상품에 대한 광고, 상품주문, 배송 및 환불의 의무와 책임은 각
              판매자가 부담하고, 이에 대하여 쿠팡은 통신판매중개자로서 통신판매의 당사자가 아니므로 일체 책임을 지지
              않습니다.
            </p>
          </div>
          <div>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</div>
          <button className="bg-blue-700 text-white text-lg font-bold w-full h-14 mt-4">결제하기</button>
        </div>
      </div>
    </Page>
  );
};

export default React.memo(Order);
