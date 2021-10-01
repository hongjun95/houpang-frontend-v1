import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import i18next from 'i18next';

import { sleep } from '@utils';
import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import { EditProductInfoProps } from '@constants';
import { editProduct, uploadImages } from '@api';
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

const EditProductInfoSchema = Yup.object().shape({
  infos: Yup.lazy((obj) =>
    Yup.array()
      .of(
        Yup.object(
          mapValues(obj, () =>
            Yup.object({
              key: Yup.string(),
              value: Yup.string(),
            }),
          ),
        ),
      )
      .optional(),
  ),
});

interface IInfoArray {
  id: number;
  key: string;
  value: string;
}

const EditProductInfoPage = ({ f7router, productId, productInfos, currentImageUrls }: EditProductInfoProps) => {
  const [infos, setInfosNumber] = useState<IInfoArray[]>([...productInfos]);
  const productName = useRecoilValue(productNameAtom);
  const productPrice = useRecoilValue(productPriceAtom);
  const productCategoryName = useRecoilValue(productCategoryNameAtom);
  const productStock = useRecoilValue(productStockAtom);
  const productImgFiles = useRecoilValue(productImgFilesAtom);

  const [infoKeys, setInfoKeys] = useState<string[]>(productInfos.map((info) => info.key));
  const [infoValues, setInfoValues] = useState<string[]>(productInfos.map((info) => info.value));

  const initialValues = {};

  const handleEditProduct = async (values, setSubmitting) => {
    await sleep(400);
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ...rest } = values;

      const submittedInfoObjects: InfoItem[] = infos.map<InfoItem>((info) => ({
        id: info.id,
        key: rest[`${info.id}-infoKey`] as string,
        value: rest[`${info.id}-infoValue`] as string,
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
      } else {
        images = currentImageUrls;
      }

      try {
        const { ok, error } = await editProduct({
          name: productName,
          price: productPrice,
          categoryName: productCategoryName,
          stock: productStock,
          images,
          infos: submittedInfoObjects,
          productId,
        });

        if (ok) {
          f7.dialog.alert('상품을 성공적으로 수정했습니다.');
          f7router.navigate(`/products/${productId}`);
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

  const onChangeInfoKey = (e: any, index: number) => {
    const {
      target: { value },
    } = e;
    infoKeys[index] = value;
    setInfoKeys(infoKeys.map((infoKey) => infoKey));
  };

  const onChangeInfoValue = (e: any, index: number) => {
    const {
      target: { value },
    } = e;
    infoValues[index] = value;
    setInfoValues(infoValues.map((infoKey) => infoKey));
  };

  const AddInfoBtn = () => {
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
      <Navbar title="상품 수정" backLink sliding={false} />
      <div className="p-4 mx-2 bg-gray-200">
        <div className="flex justify-between border-black border-t pt-4">
          <div className="p-3 font-semibold text-center">상품 정보</div>
          <div className="w-32 flex items-center">
            <button onClick={AddInfoBtn} className="p-2 rounded-lg text-white bg-blue-400">
              상품 정보 추가
            </button>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={EditProductInfoSchema}
          onSubmit={(values, { setSubmitting }) => handleEditProduct(values, setSubmitting)}
          validateOnMount
        >
          {({ handleBlur, isSubmitting, isValid, setFieldValue }) => (
            <Form>
              <List noHairlinesMd>
                <div className="p-3 flex flex-col mb-10">
                  {infos.length !== 0 &&
                    infos.map((info, index) => (
                      <ul key={info.id} className="flex border border-gray-2">
                        <ListInput
                          label={i18next.t('product.infoKey') as string}
                          type="text"
                          value={infoKeys[index]}
                          name={`${info.id}-infoKey`}
                          placeholder="상품 정보의 이름을 입력해주세요"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoKey`, e.target.value);
                            onChangeInfoKey(e, index);
                          }}
                          onBlur={handleBlur}
                        />
                        <ListInput
                          label={i18next.t('product.infoValue') as string}
                          type="text"
                          value={infoValues[index]}
                          name={`${info.id}-infoValue`}
                          placeholder="상품 정보 내용을 입력해주세요"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoValue`, e.target.value);
                            onChangeInfoValue(e, index);
                          }}
                          onBlur={handleBlur}
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
                  상품 수정
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default React.memo(EditProductInfoPage);
