import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

// import useAuth from '@hooks/useAuth';
import { List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { getCategories } from '@api';
import { AddProductInput } from '@interfaces/product.interface';
import { useQuery } from 'react-query';
import { GetAllCategoriesOutput } from '@interfaces/category.interface';
import { useSetRecoilState } from 'recoil';
import {
  productCategoryNameAtom,
  productImgFilesAtom,
  productNameAtom,
  productPriceAtom,
  productStockAtom,
} from '@atoms';

const AddProductSchema: Yup.SchemaOf<AddProductInput> = Yup.object().shape({
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

const AddProductPage = ({ f7router }: PageRouteProps) => {
  const setProducthName = useSetRecoilState(productNameAtom);
  const setProductPrice = useSetRecoilState(productPriceAtom);
  const setProductCategoryName = useSetRecoilState(productCategoryNameAtom);
  const setStockAtom = useSetRecoilState(productStockAtom);
  const setProductImgFile = useSetRecoilState(productImgFilesAtom);

  const initialValues: AddProductInput = {
    name: '',
    price: 0,
    categoryName: '패션의류',
    stock: 0,
    images: [],
  };

  const { data, status } = useQuery<GetAllCategoriesOutput, Error>(['categories_key'], getCategories);

  const handleProductContent = async (values: AddProductInput, setSubmitting) => {
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

  return (
    <Page>
      <Navbar title="상품 추가" backLink sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={AddProductSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<AddProductInput>) =>
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
              <ListInput
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
              />
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
