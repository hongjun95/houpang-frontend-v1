import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { Icon, Navbar, Page } from 'framework7-react';

import { PageRouteProps } from '@constants';
import { FormError } from '@components/form-error';
import styled from 'styled-components';
import { OrderItem } from '@interfaces/order.interface';

interface SelectProductPageProps extends PageRouteProps {
  orderItem: OrderItem;
}

interface SelectProductForm {
  productCount: string;
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

const SelectProdcutPage = ({ f7route, f7router, orderItem }: SelectProductPageProps) => {
  const orderItemId = f7route.params.orderItemId;
  const [options, setOptions] = useState<number[]>([]);

  const createOptions = (count: number) => {
    let i: number = 1;
    while (i < count) {
      i++;
      options.push(i);
      setOptions([...options]);
    }
  };

  useEffect(() => {
    createOptions(orderItem.count);
  }, []);

  const nextStepBtn = async (values: SelectProductForm, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
    f7router.navigate(`/orders/${orderItemId}/return/select-reason`, {
      props: {
        returnedCounts: values.productCount,
        orderItem,
      },
    });
  };

  const initialValues = {
    productCount: '4',
  };

  const SelectProductSchema = Yup.object().shape({
    productCount: Yup.string() //
      .required('필수 입력사항 입니다'),
  });

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
          <hr className="w-4 mx-2 border-gray-400 border-1" />

          <div className="flex">
            <OuterCircle className="bg-gray-300">
              <CircleNumber className="text-white">2</CircleNumber>
            </OuterCircle>
            <span>사유 선택</span>
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
        validationSchema={SelectProductSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<SelectProductForm>) => nextStepBtn(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, errors, touched, isSubmitting, isValid }) => (
          <Form className="px-3 py-4 bg-gray-200 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">상품을 선택해 주세요.</h2>
            <div className="pb-2 border-b bg-white rounded-lg p-4">
              <div className="flex">
                <img src={orderItem.product.images[0]} alt="" className="w-24 h-24 mr-4" />
                <div className="font-bold mb-4 h-24 ">
                  {orderItem.product.name.length > 140
                    ? `${orderItem.product.name.slice(0, 140)}...`
                    : orderItem.product.name}
                </div>
              </div>
              <div className="flex text-base items-center">
                <div className="ml-auto mr-4">{orderItem.count}개 중</div>
                <a className="item-link smart-select smart-select-init" data-open-in="popover">
                  <select //
                    name="productCount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value={1} key={1} selected={false}>
                      1
                    </option>
                    {options.map((option) => (
                      <option value={option} key={option} selected={option === 2}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FormError errorMessage={touched.productCount && errors.productCount} />
                  <div className="item-content">
                    <div className="item-inner flex items-center w-18 border border-gray-300 p-2 rounded-md">
                      <div className="item-title"></div>
                      <Icon className="ml-4 text-sm" f7="arrowtriangle_down_fill"></Icon>
                    </div>
                  </div>
                </a>
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

export default React.memo(SelectProdcutPage);
