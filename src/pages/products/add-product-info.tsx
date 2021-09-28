import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import i18next from 'i18next';

import { sleep } from '@utils';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { addProduct, uploadImages } from '@api';
import { useRecoilValue } from 'recoil';
import {
  productCategoryNameAtom,
  productImgFilesAtom,
  productNameAtom,
  productPriceAtom,
  productStockAtom,
} from '@atoms';
import { InfoItem } from '@interfaces/product.interface';
import { mapValues } from 'lodash';

const AddProductInfoSchema = Yup.object().shape({
  infos: Yup.lazy((obj) =>
    Yup.array()
      .of(
        Yup.object(
          mapValues(obj, () =>
            Yup.object({
              a: Yup.string(),
              b: Yup.string(),
            }),
          ),
        ),
      )
      .optional(),
  ),
});

interface IInfoArray {
  id: number;
}

const AddProductInfoPage = ({ f7router }: PageRouteProps) => {
  const [infos, setInfosNumber] = useState<IInfoArray[]>([]);
  const productName = useRecoilValue(productNameAtom);
  const productPrice = useRecoilValue(productPriceAtom);
  const productCategoryName = useRecoilValue(productCategoryNameAtom);
  const productStock = useRecoilValue(productStockAtom);
  const productImgFiles = useRecoilValue(productImgFilesAtom);

  const initialValues = {};

  const handleAddProduct = async (values, setSubmitting) => {
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ...rest } = values;

      const submittedInfoObjects = infos.map<InfoItem>((info) => ({
        id: info.id,
        key: rest[`${info.id}-infoKey`],
        value: rest[`${info.id}-infoValue`],
      }));

      let images: string[];
      if (productImgFiles.length !== 0) {
        const formBody = new FormData();

        for (const image of productImgFiles) {
          formBody.append('files', image);
        }
        const {
          status,
          data: { urls },
        } = await uploadImages(formBody);
        if (status === 200) {
          images = urls;
        }
      }

      try {
        const { ok, error, product } = await addProduct({
          name: productName,
          price: productPrice,
          categoryName: productCategoryName,
          stock: productStock,
          images,
          infos: submittedInfoObjects,
        });

        if (ok) {
          f7.dialog.alert('상품을 성공적으로 추가했습니다.');
          f7router.navigate(`/products/${product.id}`);
        } else {
          f7.dialog.alert(error);
        }
        f7.dialog.close();
      } catch (error) {
        f7.dialog.close();
        f7.dialog.alert(error?.response?.data || error?.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addInfoBtn = () => {
    setInfosNumber((infos) => [
      ...infos,
      {
        id: Date.now(),
        key: '',
        value: '',
      },
    ]);
  };

  return (
    <Page>
      <Navbar title="상품 추가" backLink sliding={false} />
      <div className="p-4 mx-2 bg-gray-200">
        <div className="flex justify-between border-black border-t pt-4">
          <div className="p-3 font-semibold text-center">상품 정보</div>
          <div className="w-32 flex items-center">
            <button onClick={addInfoBtn} className="p-2 rounded-lg text-white bg-blue-400">
              상품 정보 추가
            </button>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={AddProductInfoSchema}
          onSubmit={(values, { setSubmitting }) => handleAddProduct(values, setSubmitting)}
          validateOnMount
        >
          {({ handleChange, handleBlur, setFieldValue, isSubmitting, isValid }) => (
            <Form>
              <List noHairlinesMd>
                <div className="p-3 flex flex-col mb-10">
                  {infos.length !== 0 &&
                    infos.map((info) => (
                      <ul key={info.id} className="flex border border-gray-2">
                        <ListInput
                          label={i18next.t('product.infoKey') as string}
                          type="text"
                          name={`${info.id}-infoKey`}
                          placeholder="상품 정보의 이름을 입력해주세요"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoKey`, e.target.value);
                          }}
                          onBlur={handleBlur}
                        />
                        <ListInput
                          label={i18next.t('product.infoValue') as string}
                          type="text"
                          name={`${info.id}-infoValue`}
                          placeholder="상품 정보 내용을 입력해주세요"
                          clearButton
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoValue`, e.target.value);
                          }}
                        />
                      </ul>
                    ))}
                </div>
              </List>

              <div className="p-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  상품 추가
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default React.memo(AddProductInfoPage);
