import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

// import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { ChangePasswordInput } from 'src/interfaces/user.interface';
import { changePasswordAPI } from '@api';

const ChangePasswordSchema: Yup.SchemaOf<ChangePasswordInput> = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .matches(/(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/, {
      message: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
    })
    .required('필수 입력사항 입니다'),
  newPassword: Yup.string()
    .min(8, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .matches(/(?=.*[!@#$%^&\*\(\)_\+\-=\[\]\{\};\':\"\\\|,\.<>\/\?]+)(?=.*[a-zA-Z]+)(?=.*\d+)/, {
      message: '비밀번호는 문자, 숫자, 특수문자를 1개 이상 포함해야 합니다.',
    })
    .required('필수 입력사항 입니다'),
  verifyPassword: Yup.string()
    .min(8, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다'),
});

const ChangePasswordPage = ({ f7router }: PageRouteProps) => {
  // const { authenticateUser } = useAuth();
  const initialValues: ChangePasswordInput = {
    currentPassword: '',
    newPassword: '',
    verifyPassword: '',
  };

  const handleChangePassword = async (values, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ok, error } = await changePasswordAPI({ ...values });

      if (ok) {
        f7.dialog.alert('비밀번호가 성공적으로 생성되었습니다.');
        f7router.navigate('/mypage');
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
    <Page>
      <Navbar title="비밀번호 변경" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={ChangePasswordSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<ChangePasswordInput>) =>
          handleChangePassword(values, setSubmitting)
        }
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <ListInput
                label={i18next.t('login.currentPassword') as string}
                type="password"
                name="currentPassword"
                placeholder="현재 비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.currentPassword}
                errorMessageForce
                errorMessage={touched.currentPassword && errors.currentPassword}
              />
              <ListInput
                label={i18next.t('login.newPassword') as string}
                type="password"
                name="newPassword"
                placeholder="새로운 비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newPassword}
                errorMessageForce
                errorMessage={touched.newPassword && errors.newPassword}
              />
              <ListInput
                label={i18next.t('login.verifyPassword') as string}
                type="password"
                name="verifyPassword"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.verifyPassword}
                errorMessageForce
                errorMessage={touched.verifyPassword && errors.verifyPassword}
              />
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                비밀번호 변경
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(ChangePasswordPage);
