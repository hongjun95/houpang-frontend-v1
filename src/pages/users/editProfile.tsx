import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

import { sleep } from '@utils';
import { f7, List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { editProfileAPI, uploadImages } from '@api';
import useAuth from '@hooks/useAuth';
import { EditProfileForm } from 'src/interfaces/user.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import PreviewImg from '@components/PreviewImg';
import { getToken } from '@store';

const EditProfileSchema: Yup.SchemaOf<EditProfileForm> = Yup.object().shape({
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
  images: Yup.array(),
});

const EditProfilePage = ({ f7router }: PageRouteProps) => {
  const {
    currentUser: { username, email, language, address, phoneNumber, bio, userImg },
    authenticateUser,
  } = useAuth();

  const [previewImgUri, setPreviewImgUri] = useState<string | ArrayBuffer>(userImg);

  const initialValues: EditProfileForm = {
    username,
    email,
    language,
    address,
    phoneNumber,
    bio,
  };

  const handleEditProfile = async (values: EditProfileForm, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { images } = values;

      let imageUrls: string[];
      if (!!images) {
        const formBody = new FormData();

        for (const image of images) {
          formBody.append('files', image);
        }
        const {
          status,
          data: { urls },
        } = await uploadImages(formBody);
        if (status === 200) {
          imageUrls = urls;
        }
      } else {
        imageUrls = [userImg];
      }

      try {
        const { ok, error } = await editProfileAPI({ ...values, userImg: imageUrls[0] });

        if (ok) {
          f7.dialog.alert('계정이 성공적으로 수정되었습니다.');
          authenticateUser(getToken());
          f7router.navigate('/mypage');
        } else {
          f7.dialog.alert(error);
        }
        f7.dialog.close();
      } catch (error) {
        f7.dialog.close();
        f7.dialog.alert(error?.response?.data || error?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      let reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImgUri(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Page>
      <Navbar title="회원 정보 수정" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={EditProfileSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<EditProfileForm>) =>
          handleEditProfile(values, setSubmitting)
        }
        validateOnMount
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
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

              <div className="flex relative mx-2 py-2">
                <div className="flex justify-center border border-gray-300 mr-3 p-2 w-1/4">
                  <label //
                    htmlFor="upload-images"
                    className="text-blue-500 cursor-pointer flex items-center px-2"
                  >
                    <FontAwesomeIcon icon={faCamera} className="h-full mr-1" />
                    <span className="ml-2 text-justify mr w-2/3">프로필 이미지</span>
                  </label>
                  <input //
                    type="file"
                    name="images"
                    id="upload-images"
                    className="opacity-0 absolute z-0"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const images = event.target.files;
                      const myFiles = Array.from(images);
                      handlePreviewImage(event);
                      setFieldValue('images', myFiles);
                    }}
                  />
                </div>
                {previewImgUri && (
                  <PreviewImg //
                    previewImgUri={previewImgUri}
                    className="object-cover object-center h-20 w-24"
                  />
                )}
              </div>
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
