import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { Checkbox, Navbar, Page } from 'framework7-react';
import styled from 'styled-components';

import { PageRouteProps } from '@constants';
import { formmatPrice } from '@utils/index';
import { OrderItem, ReturnStatus } from '@interfaces/order.interface';
import useAuth from '@hooks/useAuth';

interface SelectSolutionPageProps extends PageRouteProps {
  orderItem: OrderItem;
  returnedCounts: number;
  problemTitle: string;
  problemDescription: string;
}

const OuterCircle = styled.div`
  position: relative;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  margin-right: 4px;
`;

const CircleNumber = styled.span`
  position: absolute;
  left: 30%;
`;

const ChevronDown = styled.i<{ returnedAddressOpen: boolean }>`
  transform: ${(props) => (props.returnedAddressOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s linear;
`;

// const StyledWrapper = styled.div`
//   width: 100px;
//   height: 100px;
//   background: #00bfb2;
//   ${(props) =>
//     props.active &&
//     `
//    animation: ${boxFade} 2s 1s infinite linear alternate;
//   `}
// `;

export enum ERequestPlaces {
  requestPlaces1 = '문 앞',
  requestPlaces2 = '배송기사가 사전에 연락 후 문 앞',
  requestPlaces3 = '경비실',
  requestPlaces4 = '그 외 장소',
}

const SelectSolutionPage = ({
  f7route,
  f7router,
  orderItem,
  returnedCounts,
  problemDescription,
  problemTitle,
}: SelectSolutionPageProps) => {
  const { currentUser } = useAuth();
  const orderItemId = f7route.params.orderItemId;
  const [status, setStatus] = useState<ReturnStatus>(ReturnStatus.Exchanged);
  const [returnedAddressOpen, setReturnedAddressOpen] = useState<boolean>(false);
  const [requestPlaces, setRequestPlaces] = useState<ERequestPlaces[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>();
  const chevronDown = useRef<HTMLElement>();

  const initialValues = {};

  const onSetStatus = (e) => {
    setStatus(e.target.name);
  };

  const getWeekDay = () => {
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[now.getDay() + 1];
    return day;
  };

  const onRequestPlaceCheck = (e) => {
    const name = e.target.name;
    if (e.target.checked) {
      setRequestPlaces([name]);
    }
  };

  const arrowToggle = () => {
    setReturnedAddressOpen((prev) => !prev);
  };

  const apply = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
    // const problemTitle = textareaRef.current.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].textContent;
    // const problemDescription = textareaRef.current.value;
    // console.log(problemTitle, problemDescription);

    console.log('requestPlaces');
    console.log(requestPlaces);
    console.log(textareaRef.current.value);
    console.log('values');
    console.log(values);
  };

  return (
    <Page className="min-h-screen">
      <Navbar title="교환, 반품 신청" backLink={true}></Navbar>
      <div className="flex justify-center w-full px-2 py-4 text-base mx-auto text-gray-400">
        <div className="flex items-center">
          <div className="flex">
            <OuterCircle className="bg-blue-700">
              <CircleNumber className="text-white">1</CircleNumber>
            </OuterCircle>
            <span className="text-blue-700">상품 선택</span>
          </div>
          <hr className="w-4 mx-2 border-blue-700 border-1" />
          <div className="flex">
            <OuterCircle className="bg-blue-700">
              <CircleNumber className="text-white">2</CircleNumber>
            </OuterCircle>
            <span className="text-blue-700">사유 선택</span>
          </div>
          <hr className="w-4 mx-2 border-blue-700 border-1" />
          <div className="flex">
            <OuterCircle className="bg-blue-700">
              <CircleNumber className="text-white">3</CircleNumber>
            </OuterCircle>
            <span className="text-blue-700">해결방법 선택</span>
          </div>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => apply(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, touched, errors, isSubmitting, isValid }) => (
          <Form className="px-3 py-4 bg-gray-200 min-h-screen">
            <div className="pb-2 border-b bg-white rounded-lg p-4">
              <div className="flex mb-4 pb-4 border-b border-gray-400">
                <img src={orderItem.product.images[0]} alt="" className="w-24 h-24 mr-4" />
                <div className="flex flex-col justify-between">
                  <div className="font-bold mb-2">
                    {orderItem.product.name.length > 140
                      ? `${orderItem.product.name.slice(0, 140)}...`
                      : orderItem.product.name}
                  </div>
                  <div className="">
                    <span>{returnedCounts}개</span>
                    <span className="mx-1">&#183;</span>
                    <span>{formmatPrice(orderItem.product.price * returnedCounts)}원</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">선택한 사유</h4>
                <div className="text-sm mb-2">{problemTitle}</div>
                <div className="border p-2 rounded-md border-gray-300">{problemDescription}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold my-4">어떤 해결 방법을 원하세요?</h2>
            <div className="pb-2 border-b bg-white rounded-lg">
              <div className="flex"></div>
              <div className="">
                <div className="w-full">
                  <ul className="pt-4">
                    <li className="px-4 pb-2 mb-2 border-b border-gray-200">
                      <Checkbox
                        name={ReturnStatus.Exchanged} //
                        className="mr-2"
                        onChange={(e) => {
                          onSetStatus(e);
                          handleChange(e);
                        }}
                        checked={status === ReturnStatus.Exchanged}
                      />
                      <span>교환</span>
                    </li>
                    <li className="px-4 mb-4">
                      <Checkbox
                        name={ReturnStatus.Returned} //
                        className="mr-2"
                        onChange={(e) => {
                          onSetStatus(e);
                          handleChange(e);
                        }}
                        checked={status === ReturnStatus.Returned}
                      />
                      <span>반품 후 환불</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {status === ReturnStatus.Exchanged ? (
              <h2 className="text-2xl font-bold my-4">회수, 배송 정보를 확인해주세요.</h2>
            ) : (
              <h2 className="text-2xl font-bold my-4">회수, 환불 정보를 확인해주세요.</h2>
            )}
            <div className="p-4 border-b bg-white rounded-lg mb-4">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="font-semibold text-base mb-2">상품 회수지</h4>
                <div className="flex justify-between">
                  <div>{currentUser.username}</div>
                  <ChevronDown //
                    className="text-base cursor-pointer icon f7-icons"
                    onClick={arrowToggle}
                    ref={chevronDown}
                    returnedAddressOpen={returnedAddressOpen}
                  >
                    chevron_down
                  </ChevronDown>
                </div>
                {returnedAddressOpen && (
                  <div className="my-2">
                    <div className="mb-2">{currentUser.address}</div>
                    <div>{currentUser.phoneNumber}</div>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-base mb-2">회수 예정일</h4>
                <div className="mb-4 pb-4 border-b border-gray-200 text-green-600">내일({getWeekDay()})</div>
              </div>
              <div className="w-full">
                <h4 className="font-semibold text-base mb-2">회수 요청사항</h4>
                <ul>
                  <li className="mb-5">
                    <Checkbox
                      name={ERequestPlaces.requestPlaces1} //
                      className="mr-2"
                      onChange={(e) => {
                        handleChange(e);
                        onRequestPlaceCheck(e);
                      }}
                      checked={requestPlaces.indexOf(ERequestPlaces.requestPlaces1) >= 0}
                    />
                    <span>문 앞</span>
                  </li>
                  <li className="mb-5">
                    <Checkbox
                      name={ERequestPlaces.requestPlaces2} //
                      className="mr-2"
                      onChange={(e) => {
                        handleChange(e);
                        onRequestPlaceCheck(e);
                      }}
                      checked={requestPlaces.indexOf(ERequestPlaces.requestPlaces2) >= 0}
                    />
                    <span>배송기사가 사전에 연락 후 문 앞</span>
                  </li>
                  <li className="mb-5">
                    <Checkbox
                      name={ERequestPlaces.requestPlaces3} //
                      className="mr-2"
                      onChange={(e) => {
                        handleChange(e);
                        onRequestPlaceCheck(e);
                      }}
                      checked={requestPlaces.indexOf(ERequestPlaces.requestPlaces3) >= 0}
                    />
                    <span>경비실</span>
                  </li>
                  <li className="">
                    <div>
                      <Checkbox
                        name={ERequestPlaces.requestPlaces4} //
                        className="mr-2"
                        onChange={(e) => {
                          handleChange(e);
                          onRequestPlaceCheck(e);
                        }}
                        checked={requestPlaces.indexOf(ERequestPlaces.requestPlaces4) >= 0}
                      />
                      <span>그 외 장소</span>
                    </div>
                    {requestPlaces.indexOf(ERequestPlaces.requestPlaces4) >= 0 && (
                      <div className="flex flex-col">
                        <div className="border border-gray-400 rounded-md mt-4 relative">
                          <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                            <span className="text-red-500 mr-2">*필수입력</span>
                            <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                          </div>
                          <textarea //
                            name={`${ERequestPlaces.requestPlaces4}-textarea`}
                            id=""
                            rows={5}
                            maxLength={250}
                            className="resize-none p-2 w-full"
                            placeholder=""
                            ref={textareaRef}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <span className="ml-auto">{textareaRef.current?.value.length}/250</span>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </div>

            {status === ReturnStatus.Exchanged ? (
              <div className="p-4 border-b bg-white rounded-lg mb-4">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="font-semibold text-base mb-2">상품 배송지</h4>
                  <div className="flex justify-between">
                    <div>{currentUser.username}</div>
                    <ChevronDown //
                      className="text-base cursor-pointer icon f7-icons"
                      onClick={arrowToggle}
                      ref={chevronDown}
                      returnedAddressOpen={returnedAddressOpen}
                    >
                      chevron_down
                    </ChevronDown>
                  </div>
                  {returnedAddressOpen && (
                    <div className="my-2">
                      <div className="mb-2">{currentUser.address}</div>
                      <div>{currentUser.phoneNumber}</div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">배송 예정일</h4>
                  <div className="text-green-600">내일({getWeekDay()})</div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b bg-white rounded-lg mb-4">
                <div>
                  <h4 className="font-semibold text-base mb-2">환불정보</h4>
                  <div className="flex justify-between mb-2">
                    <div>상품금액</div>
                    <div className="font-semibold">{formmatPrice(orderItem.product.price * returnedCounts)}원</div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div>배송비</div>
                    <div className="font-semibold">0원</div>
                  </div>
                  <div className="flex justify-between mb-2 pb-2">
                    <div>반품비</div>
                    <div className="font-semibold">0원</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2 pb-2">
                    <h4 className="font-semibold text-base mb-2">환불 예상금액</h4>
                    <div className="font-semibold text-red-500 text-base">
                      {formmatPrice(orderItem.product.price * returnedCounts)}원
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit" //
              className="w-full flex justify-center text-white bg-blue-600 rounded-md py-4 mt-4"
              disabled={isSubmitting || !isValid}
            >
              신청하기
            </button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SelectSolutionPage);
