import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';
import { List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { getCategories } from '@api';
import { AddProductForm } from '@interfaces/product.interface';
import { GetAllCategoriesOutput } from '@interfaces/category.interface';
import {
  productCategoryNameAtom,
  productImgFilesAtom,
  productNameAtom,
  productPriceAtom,
  productStockAtom,
} from '@atoms';
import PreviewImg from '@components/PreviewImg';

const AddProductSchema: Yup.SchemaOf<AddProductForm> = Yup.object().shape({
  name: Yup.string() //
    .required('필수 입력사항 입니다'),
  price: Yup.number() //
    .min(0)
    .required('필수 입력사항 입니다'),
  categoryName: Yup.string() //
    .required('필수 입력사항 입니다'),
  stock: Yup.number() //
    .min(0)
    .required('필수 입력사항 입니다'),
  images: Yup.array(),
});

const AddProductPage = ({ f7router, f7route }) => {
  const setProducthName = useSetRecoilState(productNameAtom);
  const setProductPrice = useSetRecoilState(productPriceAtom);
  const setProductCategoryName = useSetRecoilState(productCategoryNameAtom);
  const setStockAtom = useSetRecoilState(productStockAtom);
  const setProductImgFile = useSetRecoilState(productImgFilesAtom);
  const [previewImgUris, setPreviewImgUris] = useState<(string | ArrayBuffer)[]>([]);

  const { is_main }: { is_main: boolean } = f7route.query;

  const initialValues: AddProductForm = {
    name: '',
    price: 0,
    categoryName: '패션의류',
    stock: 0,
    images: [],
  };

  const { data, status } = useQuery<GetAllCategoriesOutput, Error>(['categories_key'], getCategories);

  const handleProductContent = async (values: AddProductForm, setSubmitting) => {
    setSubmitting(false);

    try {
      const { name, price, categoryName, stock, images } = values;

      if (images.length !== 0) {
        setProductImgFile(images);
      }
      setProducthName(name);
      setProductPrice(price);
      setProductCategoryName(categoryName);
      setStockAtom(stock);
      f7router.navigate('/products/add-info');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      const fileArr = Array.from(files);
      fileArr.forEach((file) => {
        let reader = new FileReader();
        reader.onload = (ev) => {
          console.log(ev.target);
          setPreviewImgUris((prev) => [...prev, ev.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Page noToolbar={!is_main}>
      <Navbar title="상품 추가" backLink={!is_main} sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={AddProductSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<AddProductForm>) =>
          handleProductContent(values, setSubmitting)
        }
        validateOnMount
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">상품 정보</div>
              <ListInput
                label={i18next.t('product.name') as string}
                type="text"
                name="name"
                placeholder="상품 이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('product.price') as string}
                type="number"
                name="price"
                placeholder="가격을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price}
                errorMessageForce
                errorMessage={touched.price && errors.price}
              />
              <ListInput
                label={i18next.t('product.stock') as string}
                type="number"
                name="stock"
                placeholder="재고를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.stock}
                errorMessageForce
                errorMessage={touched.stock && errors.stock}
              />
              {status === 'success' && (
                <ListItem title="카테고리" smartSelect>
                  <select name="categoryName" defaultValue={`${data.categories[0].name}`}>
                    {data.categories.map((category) => (
                      <option key={category.id} value={`${category.name}`}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </ListItem>
              )}
              {/* <ListInput
                label={i18next.t('product.image') as string}
                type="file"
                name="images"
                className="pb-4"
                clearButton
                multiple
                onChange={(event) => {
                  const images = event.target.files;
                  const myFiles = Array.from(images);
                  setFieldValue('images', myFiles);
                }}
              /> */}
              {/* <div className="flex relative mx-2 py-2"> */}
              <div className="flex justify-center py-2 border-b border-gray-400 relative">
                <label //
                  htmlFor="upload-images"
                  className="text-blue-500 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faCamera} />
                  첨부하기
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
              <div className="grid grid-cols-5 grid-flow-row mt-3 gap-3 mx-4">
                {previewImgUris &&
                  previewImgUris.map((previewImgUri) => (
                    <PreviewImg //
                      previewImgUri={previewImgUri}
                      className="object-cover object-center h-20 w-24 rounded-sm"
                    />
                  ))}
              </div>
            </List>
            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                다음
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(AddProductPage);
