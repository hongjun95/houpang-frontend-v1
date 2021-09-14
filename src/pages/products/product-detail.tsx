import React, { useState } from 'react';
import { Navbar, Page, Sheet, Stepper, Swiper, SwiperSlide } from 'framework7-react';
import { useQuery } from 'react-query';

import { PageRouteProps } from '@constants';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { productKeys } from '@reactQuery/query-keys';
import { findProductById } from '@api';
import { formmatPrice } from '@utils/index';
import LandingPage from '@pages/landing';

const ProductDetailPage = ({ f7route }: PageRouteProps) => {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);

  const productId = f7route.params.id;

  const { data, status } = useQuery<FindProductByIdOutput, Error>(
    productKeys.detail(productId),
    () => findProductById({ productId }),
    {
      enabled: !!productId,
    },
  );

  if (status === 'success') console.log(data.product);

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품상세" backLink={true}></Navbar>

      {status === 'success' ? (
        <>
          <Swiper pagination className="h-3/4">
            {data?.product?.images.map((imageUrl) => (
              <SwiperSlide key={Date.now() + imageUrl}>
                <img src={imageUrl} alt="" className="h-full w-full" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="Main__info mx-2 my-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center">
                <img className="rounded-full w-10 h-10 mr-2" src={data.product.provider.userImg} alt="브랜드 이미지" />
                <div>
                  <div>{data.product.provider.username}</div>
                  <div className="text-gray-400 text-sm">브랜드</div>
                </div>
              </div>
              <div className="text-center">review stars (review number)</div>
            </div>
            <h1 className="text-xl my-4">{data.product.name}</h1>
            <div className="text-red-700 text-xl font-bold">{formmatPrice(data.product.price)}원</div>
          </div>
          <div className="w-full h-3 bg-gray-300"></div>
          <div className="Product__info mx-2 my-4">
            <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-4 mb-4">상품정보</h2>
            <table className="border border-gray-400 w-full">
              <tbody>
                {data?.product?.info?.map((aInfo) => (
                  <tr>
                    <td className="bg-gray-200 py-1 pl-2 text-gray-500">{aInfo.key}</td>
                    <td className="numeric-cell py-1 pl-2">{aInfo.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="bg-gray-200 py-1 pl-2 text-gray-500">후팡 상품 번호</td>
                  <td className="numeric-cell py-1 pl-2">{data.product.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="Review__sector pb-20">Review sector</div>
          <div className="flex fixed bottom-2 border-t-2 botder-gray-600 w-full p-2 bg-white">
            <i className="f7-icons m-3 text-gray-500">heart</i>
            <button
              className="sheet-open border mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
              data-sheet=".buy"
            >
              구매하기
            </button>
          </div>
          {/* <Toolbar>
            <div>
              <Icon f7="heart" className="text-red-500" size="20px" />
            </div>
            <Button fill sheetOpen=".buy-option" className="w-11/12">
              구매하기
            </Button>
          </Toolbar> */}
          <Sheet
            className="buy p-2 h-52"
            opened={sheetOpened}
            closeByOutsideClick
            onSheetClosed={() => {
              setSheetOpened(false);
            }}
          >
            <h3 className="text-lg font-bold mt-2">{data.product.name}</h3>
            <div className="text-red-700 text-sm font-bold my-2">{formmatPrice(data.product.price)}원</div>
            <Stepper
              value={orderCount}
              onStepperChange={setOrderCount}
              className="my-4 text-gray-300 border-gray-200"
            />
            <div className="flex">
              <button className="border border-blue-600 text-blue-600 font-bold text-base tracking-normal rounded-md p-2 mr-2">
                장바구니에 담기
              </button>
              <button className="border bg-blue-600 text-white font-bold text-base tracking-normal rounded-md p-2 ml-2">
                바로구매
              </button>
            </div>
          </Sheet>
        </>
      ) : (
        <LandingPage />
      )}
    </Page>
  );
};

export default React.memo(ProductDetailPage);
