import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { Icon, Navbar, Page } from 'framework7-react';

import { PageRouteProps } from '@constants';
import { FormError } from '@components/form-error';

interface ChooseReasonPageProps extends PageRouteProps {
  returnedCounts: string;
}

interface ChooseReasonForm {
  productCount: string;
}

const ChooseReasonSchema = Yup.object().shape({
  productCount: Yup.string() //
    .required('필수 입력사항 입니다'),
});

const ChooseReasonPage = ({ returnedCounts, f7route, f7router }: ChooseReasonPageProps) => {
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
    createOptions(4);
  }, []);

  const nextStepBtn = async (values: ChooseReasonForm, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(false);
    f7router.navigate(`/orders/${orderItemId}/return/choose-reason`, {
      props: {
        returnedCounts: values.productCount,
      },
    });
  };

  const initialValues = {
    productCount: '1',
  };

  return (
    <Page className="min-h-screen">
      <Navbar title="주문목록" backLink={true}></Navbar>
      <Formik
        initialValues={initialValues}
        validationSchema={ChooseReasonSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<ChooseReasonForm>) => nextStepBtn(values, setSubmitting)}
        validateOnMount
      >
        {({ handleChange, handleBlur, errors, touched, isSubmitting, isValid }) => (
          <Form className="px-3 py-4 bg-gray-200 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">상품을 선택해 주세요.</h2>
            <div className="pb-2 border-b bg-white rounded-lg p-4">
              <div className="flex"></div>
              <div className="flex text-base items-center">
                <a className="item-link smart-select smart-select-init" data-open-in="popover">
                  <select //
                    name="productCount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value={1} key={1}>
                      1
                    </option>
                    {options.map((option) => (
                      <option value={option} key={option}>
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

export default React.memo(ChooseReasonPage);
