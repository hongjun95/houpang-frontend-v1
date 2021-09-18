import React from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import i18next from 'i18next';

import { List, ListInput, ListItem, Navbar, Page } from 'framework7-react';
import { getCategories } from '@api';
import { EditProductForm, FindProductByIdOutput } from '@interfaces/product.interface';
import { useQuery, useQueryClient } from 'react-query';
import { GetAllCategoriesOutput } from '@interfaces/category.interface';
import { useSetRecoilState } from 'recoil';
import {
  productCategoryNameAtom,
  productImgFilesAtom,
  productNameAtom,
  productPriceAtom,
  productStockAtom,
} from '@atoms';
import { productKeys } from '@reactQuery/query-keys';

const EditProductSchema: Yup.SchemaOf<EditProductForm> = Yup.object().shape({
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

const EditProductInfoPage = ({ f7router, f7route }) => {
  const setProducthName = useSetRecoilState(productNameAtom);
  const setProductPrice = useSetRecoilState(productPriceAtom);
  const setProductCategoryName = useSetRecoilState(productCategoryNameAtom);
  const setStockAtom = useSetRecoilState(productStockAtom);
  const setProductImgFile = useSetRecoilState(productImgFilesAtom);

  const queryClient = useQueryClient();
  const productId = f7route.params.id;

  const productData = queryClient.getQueryData<FindProductByIdOutput>(productKeys.detail(productId));

  const { is_main }: { is_main: boolean } = f7route.query;

  const initialValues: EditProductForm = {
    name: productData.product.name,
    price: productData.product.price,
    categoryName: productData.product.category.name,
    stock: productData.product.stock,
    images: [],
  };

  const { data: categoryData, status } = useQuery<GetAllCategoriesOutput, Error>(['categories_key'], getCategories);

  const handleProductContent = async (values: EditProductForm, setSubmitting) => {
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
      f7router.navigate(`/products/${productId}/edit-info`, {
        props: {
          productId,
          productInfos: productData.product.infos || [],
          currentImageUrls: productData.product.images,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Page noToolbar={!is_main}>
      <Navbar title="상품 수정" backLink={!is_main} sliding={false} />
      <p className="font-semibole text-4xl text-center mt-5">Houpang</p>
      <Formik
        initialValues={initialValues}
        validationSchema={EditProductSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<EditProductForm>) =>
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
                  <select name="categoryName" defaultValue={`${categoryData.categories[0].name}`}>
                    {categoryData.categories.map((category) => (
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

export default React.memo(EditProductInfoPage);
