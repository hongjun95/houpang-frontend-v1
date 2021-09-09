import React from 'react';
import * as Yup from 'yup';
import i18next from 'i18next';
import { Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';

import useAuth from '@hooks/useAuth';
import { PageRouteProps } from '@constants';
import UserService from '@service/users/users.service';

interface SignInInput {
  email: string;
  password: string;
}

interface SignInPageProps extends PageRouteProps {
  usersService: UserService;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string() //
    .email('이메일을 입력하세요')
    .required('필수 입력사항 입니다'),
  password: Yup.string()
    .min(8, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .matches(/(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/, {
      message: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
    })
    .required('필수 입력사항 입니다'),
});

const initialValues: SignInInput = { email: '', password: '' };

const SessionNewPage = ({ usersService, f7router }: SignInPageProps) => {
  const { authenticateUser } = useAuth();

  const handleLogin = async (values: SignInInput, setSubmitting: (isSubmitting: boolean) => void) => {
    setSubmitting(true);
    try {
      const { ok, error, token } = await usersService.login({ ...values });
      if (ok) {
        authenticateUser({ csrf: '', token });
        f7.dialog.alert('성공적으로 로그인 하였습니다. ');
        f7router.navigate('/');
      } else {
        f7.dialog.alert(error);
      }
    } catch (error) {
      console.error(error);
      f7.dialog.alert('정보를 확인 해주세요. ');
      setSubmitting(false);
    }
  };

  return (
    <Page className="bg-white">
      <Navbar title={i18next.t('login.title') as string} backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<SignInInput>) => handleLogin(values, setSubmitting)}
        validateOnMount
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <List>
              <ListInput
                label={i18next.t('login.email') as string}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password') as string}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
            </List>
            <div className="p-1">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                로그인
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(SessionNewPage);
