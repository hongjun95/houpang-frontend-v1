import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { Checkbox, Icon, Navbar, Page } from 'framework7-react';
import styled from 'styled-components';

import { PageRouteProps } from '@constants';
import { OrderItem } from '@interfaces/order.interface';

interface SelectReasonPageProps extends PageRouteProps {
  returnedCounts: string;
  productName: string;
  productImage: string;
  productCount: number;
  productPrice: number;
  orderItem: OrderItem;
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

const SelectReasonPage = ({
  f7route,
  f7router,
  returnedCounts,
  productName,
  productImage,
  productCount,
  productPrice,
  orderItem,
}: SelectReasonPageProps) => {
  const orderItemId = f7route.params.orderItemId;
  const [changedMind, setChangedMind] = useState<boolean>(false);
  const [changedMinds, setChangedMinds] = useState<string[]>([]);
  const [productProblems, setProductProblems] = useState<string[]>([]);
  const [deliverProblems, setDeliverProblems] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>();

  console.log(`returnedCounts : ${returnedCounts}`);

  const nextStepBtn = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
    const problemTitle = textareaRef.current.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].textContent;
    const problemDescription = textareaRef.current.value;

    console.log(problemTitle, problemDescription);

    f7router.navigate(`/orders/${orderItemId}/return/select-solution`, {
      props: {
        productName,
        productImage,
        productPrice,
        returnedCounts,
        problemTitle,
        problemDescription,
        orderItem,
      },
    });
  };

  const initialValues = {};

  const onSetChangedMind = (e) => {
    if (e.target.checked) {
      setChangedMind(true);
      setProductProblems([]);
      setDeliverProblems([]);
    } else {
      setChangedMind(false);
    }
  };

  const onChangedMindCheck = (e) => {
    const name = e.target.name;
    if (e.target.checked) {
      setChangedMinds([name]);
      setProductProblems([]);
      setDeliverProblems([]);
    }
  };

  const onProductProblemCheck = (e) => {
    const name = e.target.name;
    if (e.target.checked) {
      setProductProblems([name]);
      setChangedMinds([]);
      setDeliverProblems([]);
      setChangedMind(false);
    }
  };

  const onDeliverProblemCheck = (e) => {
    const name = e.target.name;
    if (e.target.checked) {
      setDeliverProblems([name]);
      setChangedMinds([]);
      setProductProblems([]);
      setChangedMind(false);
    }
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
          <hr className="w-4 mx-2 border-gray-400 border-1" />
          <div className="flex">
            <OuterCircle className="bg-gray-300">
              <CircleNumber className="text-white">3</CircleNumber>
            </OuterCircle>
            <span>해결방법 선택</span>
          </div>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => nextStepBtn(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, isSubmitting, isValid }) => (
          <Form className="px-3 py-4 bg-gray-200 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">어떤 문제가 있나요?</h2>
            <div className="pb-2 border-b bg-white rounded-lg">
              <div className="flex"></div>
              <div className="">
                <div className={`w-full ${changedMind ? '' : 'border-b border-gray-200'}`}>
                  <h3 className="mb-3 px-4 pt-4">단순 변심</h3>
                  <ul>
                    <li className="px-4 mb-4">
                      <Checkbox
                        name="changedMind" //
                        className="mr-2"
                        onChange={onSetChangedMind}
                        checked={changedMind}
                      />
                      <span>상품이 마음에 들지 않음</span>
                    </li>
                    {changedMind && (
                      <ul className="pl-8 bg-gray-300 mb-2">
                        <li>
                          <div>
                            <Checkbox
                              name="changedMind1-check" //
                              className="mr-2 bg-white rounded-full my-4"
                              onChange={(e) => {
                                handleChange(e);
                                onChangedMindCheck(e);
                              }}
                              checked={changedMinds.indexOf('changedMind1-check') >= 0}
                            />
                            <span>품질 불만</span>
                          </div>
                          {changedMinds.indexOf('changedMind1-check') >= 0 && (
                            <div className="flex flex-col mr-4">
                              <div className="border border-gray-400 rounded-md mt-4 relative">
                                <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                                  <span className="text-red-500 mr-2">*필수입력</span>
                                  <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                                </div>
                                <textarea //
                                  name="changedMind1"
                                  id=""
                                  rows={5}
                                  maxLength={250}
                                  className="resize-none p-2 w-full"
                                  placeholder=""
                                  ref={textareaRef}
                                  onChange={handleChange}
                                ></textarea>
                              </div>
                              <span className="ml-auto">{textareaRef.current?.value.length || 0}/250</span>
                            </div>
                          )}
                        </li>
                        <li>
                          <div>
                            <Checkbox
                              name="changedMind2-check" //
                              className="mr-2 bg-white rounded-full"
                              onChange={(e) => {
                                handleChange(e);
                                onChangedMindCheck(e);
                              }}
                              checked={changedMinds.indexOf('changedMind2-check') >= 0}
                            />
                            <span>필요 없어짐</span>
                          </div>
                          {changedMinds.indexOf('changedMind2-check') >= 0 && (
                            <div className="flex flex-col mr-4">
                              <div className="border border-gray-400 rounded-md mt-4 relative">
                                <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                                  <span className="text-red-500 mr-2">*필수입력</span>
                                  <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                                </div>
                                <textarea //
                                  name="changedMind2"
                                  id=""
                                  rows={5}
                                  maxLength={250}
                                  className="resize-none p-2 w-full"
                                  placeholder=""
                                  ref={textareaRef}
                                  onChange={handleChange}
                                ></textarea>
                              </div>
                              <span className="ml-auto">{textareaRef.current?.value.length || 0}/250</span>
                            </div>
                          )}
                        </li>
                        <li>
                          <div>
                            <Checkbox
                              name="changedMind3-check" //
                              className="mr-2 bg-white rounded-full my-4"
                              onChange={(e) => {
                                handleChange(e);
                                onChangedMindCheck(e);
                              }}
                              checked={changedMinds.indexOf('changedMind3-check') >= 0}
                            />
                            <span>그 외 문제</span>
                          </div>
                          {changedMinds.indexOf('changedMind3-check') >= 0 && (
                            <div className="flex flex-col mr-4 pb-4">
                              <div className="border border-gray-400 rounded-md mt-4 relative">
                                <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                                  <span className="text-red-500 mr-2">*필수입력</span>
                                  <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                                </div>
                                <textarea //
                                  name="changedMind3"
                                  id=""
                                  rows={5}
                                  maxLength={250}
                                  className="resize-none p-2 w-full"
                                  placeholder=""
                                  ref={textareaRef}
                                  onChange={handleChange}
                                ></textarea>
                              </div>
                              <span className="ml-auto">{textareaRef.current?.value.length || 0}/250</span>
                            </div>
                          )}
                        </li>
                      </ul>
                    )}
                  </ul>
                </div>
                <div className="border-b border-gray-200 w-full">
                  <h3 className="mb-3 px-4 pt-4">상품 문제</h3>
                  <ul>
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="productProblem1-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onProductProblemCheck(e);
                          }}
                          checked={productProblems.indexOf('productProblem1-check') >= 0}
                        />
                        <span>상품의 구성품/부속품이 들어있지 않음</span>
                      </div>
                      {productProblems.indexOf('productProblem1-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="productProblem1"
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
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="productProblem2-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onProductProblemCheck(e);
                          }}
                          checked={productProblems.indexOf('productProblem2-check') >= 0}
                        />
                        <span>상품이 설명과 다름</span>
                      </div>
                      {productProblems.indexOf('productProblem2-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="productProblem2"
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
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="productProblem3-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onProductProblemCheck(e);
                          }}
                          checked={productProblems.indexOf('productProblem3-check') >= 0}
                        />
                        <span>다른 상품이 배송됨</span>
                      </div>
                      {productProblems.indexOf('productProblem3-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="productProblem3"
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
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="productProblem4-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onProductProblemCheck(e);
                          }}
                          checked={productProblems.indexOf('productProblem4-check') >= 0}
                        />
                        <span>상품이 파손됨/기능 오동작</span>
                      </div>
                      {productProblems.indexOf('productProblem4-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="productProblem4"
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
                <div className="border-b border-gray-200 w-full">
                  <h3 className="mb-3 px-4 pt-4">배송 문제</h3>
                  <ul>
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="deliverProblem1-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onDeliverProblemCheck(e);
                          }}
                          checked={deliverProblems.indexOf('deliverProblem1-check') >= 0}
                        />
                        <span>배송된 장소에 박스가 분실됨</span>
                      </div>
                      {deliverProblems.indexOf('deliverProblem1-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="deliverProblem1"
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
                    <li className="px-4 mb-4">
                      <div>
                        <Checkbox
                          name="deliverProblem2-check" //
                          className="mr-2"
                          onChange={(e) => {
                            handleChange(e);
                            onDeliverProblemCheck(e);
                          }}
                          checked={deliverProblems.indexOf('deliverProblem2-check') >= 0}
                        />
                        <span>선택한 주소가 아닌 다른 주소로 배송됨</span>
                      </div>
                      {deliverProblems.indexOf('deliverProblem2-check') >= 0 && (
                        <div className="flex flex-col">
                          <div className="border border-gray-400 rounded-md mt-4 relative">
                            <div className={`${textareaRef.current?.value ? 'hidden' : ''} absolute left-2 top-2`}>
                              <span className="text-red-500 mr-2">*필수입력</span>
                              <span className="text-gray-400">누락된 구성품 / 부속품을 입력해주세요.</span>
                            </div>
                            <textarea //
                              name="deliverProblem2"
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
            </div>
            <button
              type="submit" //
              className="w-full flex justify-center text-white bg-blue-600 rounded-md py-4 mt-4"
              disabled={isSubmitting || !isValid}
            >
              <span>다음 단계</span>
              <div className="flex item justify-center">
                <Icon f7="chevron_right" className="text-base"></Icon>
              </div>
            </button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SelectReasonPage);
