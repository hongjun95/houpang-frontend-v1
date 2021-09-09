import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

import { signupAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';

interface FormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email('이메일을 입력하세요').required('필수 입력사항 입니다'),
  password: Yup.string().min(8, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
  password_verification: Yup.string()
    .min(8, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다'),
});

const SignUpPage = () => {
  const { authenticateUser } = useAuth();
  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  return (
    <Page>
      <Navbar title="회원가입" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">insomenia</p>
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader('잠시만 기다려주세요...');
          try {
            const { data: user } = await signupAPI({ ...values });
            f7.dialog.close();
            authenticateUser(user);
          } catch (error) {
            f7.dialog.close();
            f7.dialog.alert(error?.response?.data || error?.message);
          }
        }}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">기본 정보</div>
              <ListInput
                label={i18next.t('login.name') as string}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('login.email') as string}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password') as string}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t('login.password_confirmation') as string}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce
                errorMessage={touched.password_confirmation && errors.password_confirmation}
              />
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SignUpPage);
