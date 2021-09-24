import React from 'react';
import * as Yup from 'yup';
import { f7, Navbar, Page } from 'framework7-react';
import { Form, Formik, FormikHelpers } from 'formik';

import useAuth from '@hooks/useAuth';
import { getShoppingList } from '@store';
import { DELIVERY_FEE, PageRouteProps } from '@constants';
import { formmatPrice, sleep } from '@utils/index';
import { OrderForm } from '@interfaces/order.interface';
import { FormError } from '@components/form-error';
import { createOrderAPI } from '@api';

interface OrderProps extends PageRouteProps {
  items: string[];
  totalPrice: number;
}

const OrderSchema: Yup.SchemaOf<OrderForm> = Yup.object().shape({
  deliverRequest: Yup.string().min(0).max(50, '배송 요청사항은 최대 50 자까지 적을 수 있습니다.').optional(),
});

const OrderPage = ({ items, totalPrice, f7router }: OrderProps) => {
  const { currentUser } = useAuth();
  const shoppingList = getShoppingList(currentUser.id);
  const orderList = shoppingList.filter((item) => items.includes(item.id));

  const initialValues: OrderForm = {
    deliverRequest: '',
  };

  const createOrderItems = orderList.map((item) => ({ productId: item.id, count: item.orderCount }));

  const handleBuy = async (values: OrderForm, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ok, error } = await createOrderAPI({
        deliverRequest: values.deliverRequest,
        destination: currentUser.address,
        createOrderItems,
      });
      if (ok) {
        f7.dialog.alert('성공적으로 주문하였습니다.');
        f7router.navigate('/orders');
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="주문/결제" backLink={true}></Navbar>
      <Formik
        initialValues={initialValues}
        validationSchema={OrderSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<OrderForm>) => handleBuy(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
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
                    name="deliverRequest"
                    placeholder="배송 요청사항"
                    maxLength={50}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.deliverRequest}
                  />
                  <FormError errorMessage={touched.deliverRequest && errors.deliverRequest}></FormError>
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
                    * 개별 판매자가 등록한 마켓플레이스(오픈마켓) 상품에 대한 광고, 상품주문, 배송 및 환불의 의무와
                    책임은 각 판매자가 부담하고, 이에 대하여 쿠팡은 통신판매중개자로서 통신판매의 당사자가 아니므로 일체
                    책임을 지지 않습니다.
                  </p>
                </div>
                <div>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</div>
                <button type="submit" className="bg-blue-700 text-white text-lg font-bold w-full h-14 mt-4">
                  결제하기
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(OrderPage);
