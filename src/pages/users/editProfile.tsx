import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

// import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { f7, List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { editProfileAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { EditProfileInput } from 'src/interfaces/user.interface';

const EditProfileSchema: Yup.SchemaOf<EditProfileInput> = Yup.object().shape({
  username: Yup.string() //
    .required('필수 입력사항 입니다'),
  email: Yup.string() //
    .email('이메일을 입력하세요')
    .required('필수 입력사항 입니다'),
  language: Yup.mixed()
    .oneOf(['Korean', 'English']) //
    .required('필수 입력사항 입니다'),
  address: Yup.string() //
    .required('필수 입력사항 입니다'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/, {
      message: "'-'를 포함한 전하번호 11자리를 입력하세요.",
    })
    .required('필수 입력사항 입니다'),
  bio: Yup.string().optional(),
});

const EditProfilePage = ({ f7router }: PageRouteProps) => {
  const {
    authenticateUser,
    currentUser: { username, email, language, address, phoneNumber, bio },
  } = useAuth();
  const initialValues: EditProfileInput = {
    username,
    email,
    language,
    address,
    phoneNumber,
    bio,
  };

  const handleEditProfile = async (values: EditProfileInput, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ok, error } = await editProfileAPI({ ...values });

      if (ok) {
        f7.dialog.alert('계정이 성공적으로 수정되었습니다.');
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
      <Navbar title="회원 정보 수정" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<EditProfileInput>) =>
          handleEditProfile(values, setSubmitting)
        }
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">기본 정보</div>
              <ListInput
                label={i18next.t('login.username') as string}
                type="text"
                name="username"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                errorMessageForce
                errorMessage={touched.username && errors.username}
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
            </List>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">세부 정보</div>
              <ListInput
                label={i18next.t('login.phoneNumber') as string}
                type="text"
                name="phoneNumber"
                placeholder="전화번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phoneNumber}
                errorMessageForce
                errorMessage={touched.phoneNumber && errors.phoneNumber}
              />
              <ListInput
                label={i18next.t('login.address') as string}
                type="text"
                name="address"
                placeholder="주소를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                errorMessageForce
                errorMessage={touched.address && errors.address}
              />
              <ListInput
                label={i18next.t('login.bio') as string}
                type="textarea"
                name="bio"
                placeholder="자기소개를 써주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.bio}
                errorMessageForce
                errorMessage={touched.bio && errors.bio}
              />
              <ListItem title="Language" smartSelect>
                <select name="language" defaultValue="Korean">
                  <option value="Korean">Korean</option>
                  <option value="English">English</option>
                </select>
              </ListItem>
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원 정보 수정
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(EditProfilePage);