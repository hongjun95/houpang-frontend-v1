import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import { useQueryClient } from 'react-query';
import { f7, List, Navbar, Page } from 'framework7-react';

import RatingStar from '@components/RatingStar';
import PreviewImg from '@components/PreviewImg';
import { uploadImages, createReviewAPI } from '@api';
import { CreateReviewForm } from '@interfaces/review.interface';
import { productKeys } from '@reactQuery/query-keys';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { formmatPrice } from '@utils/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const CreateReviewPage = ({ f7router, f7route }) => {
  const [rating, setRating] = useState(0);
  const [previewImgUris, setPreviewImgUris] = useState<(string | ArrayBuffer)[]>([]);

  const productId = f7route.params.id;
  const { is_main }: { is_main: boolean } = f7route.query;
  const initialValues: CreateReviewForm = {
    content: '',
    images: [],
  };
  const queryClient = useQueryClient();
  const productData = queryClient.getQueryData<FindProductByIdOutput>(productKeys.detail(productId));
  const createReviewSchema: Yup.SchemaOf<CreateReviewForm> = Yup.object().shape({
    content: Yup.string(),
    images: Yup.array(),
  });

  const handleCreateReview = async (values: CreateReviewForm, setSubmitting) => {
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { content, images } = values;

      let imageUrls: string[];
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

      try {
        const { ok, error, review } = await createReviewAPI({
          productId,
          content,
          rating,
          images: imageUrls,
        });

        if (ok) {
          f7.dialog.alert('리뷰를 작성했습니다.');
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
      <Navbar title="리뷰 작성" backLink={!is_main} sliding={false} />
      <h2 className="p-3 font-semibold text-2xl mt-5">상품 품질 평가</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={createReviewSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<CreateReviewForm>) =>
          handleCreateReview(values, setSubmitting)
        }
        validateOnMount
      >
        {({ handleChange, values, setFieldValue, isSubmitting, isValid }) => (
          <Form className="p-5">
            <List noHairlinesMd>
              <div className="flex pb-2 my-4" key={productData.product.id}>
                <div className="w-1/5  mr-4">
                  <img src={productData.product.images[0]} alt="" className="w-full" />
                </div>
                <div className="flex flex-col">
                  <div className="font-bold mb-2">{productData.product.name}</div>
                  <div className="">
                    <span className="font-bold text-lg">{formmatPrice(productData.product.price)}</span>
                    <span>원</span>
                  </div>
                </div>
              </div>

              <p className="text-sm">이 상품의 품질에 대해 얼마나 만족하시나요?</p>
              <RatingStar //
                count={5}
                rating={rating}
                onRating={(rate) => setRating(rate)}
                color={{
                  filled: '#ffe259',
                  unfilled: '#DCDCDC',
                }}
              />
              <p className="text-sm mb-2">이 상품을 상세히 평가해주세요</p>
              <div className="border border-gray-400 rounded-sm mt-4 relative">
                <textarea //
                  name="content"
                  id=""
                  rows={5}
                  maxLength={250}
                  className="resize-none p-2 w-full"
                  placeholder="상품 품질에 대한 고객님의 솔직한 평가를 남겨주세요."
                  onChange={handleChange}
                  value={values.content}
                ></textarea>
                <div className="flex justify-center py-2 border-t border-gray-400">
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
              </div>
              <div className="grid grid-cols-5 grid-flow-row mt-3 gap-3">
                {previewImgUris &&
                  previewImgUris.map((previewImgUri) => (
                    <PreviewImg //
                      previewImgUri={previewImgUri}
                      className="object-cover h-20 w-24"
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
                리뷰 작성 완료
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default React.memo(CreateReviewPage);
