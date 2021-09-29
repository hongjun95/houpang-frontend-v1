import React, { useState } from 'react';
import { f7, Navbar, Page, Sheet, Stepper, Swiper, SwiperSlide } from 'framework7-react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPen } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { PageRouteProps } from '@constants';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { productKeys, reviewKeys } from '@reactQuery/query-keys';
import { deleteProduct, findProductById, getReviewOnProductAPI, likeProductAPI, unlikeProductAPI } from '@api';
import { formmatPrice } from '@utils/index';
import LandingPage from '@pages/landing';
import { saveShoppingList, existedProductOnShoppingList, getShoppingList, IShoppingItem } from '@store';
import useAuth from '@hooks/useAuth';
import { Like } from '@interfaces/like.interface';
import { likeListAtom, shoppingListAtom } from '@atoms';
import { UserRole } from '@interfaces/user.interface';
import { GetReviewsOnProductOutput } from '@interfaces/review.interface';
import StaticRatingStar from '@components/StaticRatingStar';

const ProductPrice = styled.div`
  flex: 4 1;
`;

const ProductEditLink = styled.a`
  flex: 2rem 1;
`;

const ProductDeleteBtn = styled.button`
  flex: 2rem 1;
`;

const ProductDetailPage = ({ f7route, f7router }: PageRouteProps) => {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [like, setLike] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(1);
  const [likeList, setLikeList] = useRecoilState<Like>(likeListAtom);
  const setShoppingList = useSetRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const { currentUser } = useAuth();
  const productId = f7route.params.id;

  const { data: productData, status: productStatus } = useQuery<FindProductByIdOutput, Error>(
    productKeys.detail(productId),
    () => findProductById({ productId }),
    {
      enabled: !!productId,
    },
  );

  const { data: reviewData, status: reviewStatus } = useQuery<GetReviewsOnProductOutput, Error>(
    reviewKeys.list({ productId, page: 1 }),
    () => getReviewOnProductAPI({ productId, page: 1 }),
  );

  const onAddProductToShoppingList = () => {
    const shoppingList = getShoppingList(currentUser.id);
    if (existedProductOnShoppingList(currentUser.id, productId)) {
      f7.dialog.alert('이미 장바구니에 있습니다.');
    } else {
      f7.dialog.alert('장바구니에 담았습니다.');
      const shoppingItem: IShoppingItem = {
        id: productId,
        name: productData.product.name,
        price: productData.product.price,
        imageUrl: productData.product.images[0],
        orderCount: 1,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(currentUser.id, shoppingList);
      setShoppingList(shoppingList);
    }
  };

  const likeProduct = async (e) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    setLike(true);
    setLikeList((prev) => ({
      ...prev,
      products: [...prev.products, { ...productData.product }],
    }));
    try {
      const { ok, error } = await likeProductAPI({ productId });

      if (ok) {
        f7.dialog.alert('찜 했습니다.');
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.productData || error?.message);
    }
  };
  const unlikeProduct = async (e) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    setLike(false);
    setLikeList((prev) => ({
      ...prev,
      products: [...prev.products.filter((product) => product.id !== productId)],
    }));
    try {
      const { ok, error } = await unlikeProductAPI({ productId });

      if (ok) {
        f7.dialog.alert('취소 했습니다.');
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.productData || error?.message);
    }
  };

  const onDeleteBtn = async () => {
    try {
      // const ok = await f7.dialog.confirm('정말로 삭제하시겠습니까?');
      const ok = window.confirm('정말 삭제하시겠습니까?');
      if (ok) {
        await deleteProduct({ productId });
        f7router.navigate(`/products?categoryId=${productData.product.category.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = () => {
    f7router.navigate('/order', {
      props: {
        items: [productData.product.id],
        totalPrice: productData.product.price,
      },
    });
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품상세" backLink={true}></Navbar>

      {productStatus === 'success' ? (
        <>
          <Swiper pagination className="h-3/4">
            {productData?.product?.images.map((imageUrl) => (
              <SwiperSlide key={Date.now() + imageUrl}>
                <img src={imageUrl} alt="" className="h-full w-full" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="Main__info mx-2 my-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center">
                <img
                  className="rounded-full w-10 h-10 mr-2"
                  src={productData.product.provider.userImg}
                  alt="브랜드 이미지"
                />
                <div>
                  <div>{productData.product.provider.username}</div>
                  <div className="text-gray-400 text-sm">브랜드</div>
                </div>
              </div>
              {reviewStatus === 'success' && reviewData.reviews.length !== 0 && (
                <a href="#" className="flex items-center">
                  <div className="mr-1">
                    <StaticRatingStar //
                      count={5}
                      rating={Math.ceil(reviewData.avgRating)}
                      color={{
                        filled: '#ffe259',
                        unfilled: '#DCDCDC',
                      }}
                      className="text-xl"
                    />
                  </div>
                  <div className="text-blue-500 text-base mb-1">({reviewData.totalResults})</div>
                </a>
              )}
            </div>
            <div className="flex my-4">
              <h1 className="text-xl mr-1 truncate">{productData.product.name}</h1>
            </div>
            <div className="flex">
              <ProductPrice className="text-red-700 text-xl font-bold">
                {formmatPrice(productData.product.price)}원
              </ProductPrice>
              {currentUser.role === UserRole.Provider && (
                <ProductEditLink
                  className="block w-2 py-1 text-center text-white bg-blue-600 rounded-md mr-2"
                  href={`/products/${productId}/edit`}
                >
                  수정
                </ProductEditLink>
              )}
              {currentUser.role === UserRole.Provider && (
                <ProductDeleteBtn
                  className="block w-2 py-1 text-center text-white bg-red-600 rounded-md"
                  onClick={onDeleteBtn}
                >
                  삭제
                </ProductDeleteBtn>
              )}
            </div>
          </div>
          <div className="w-full h-3 bg-gray-300"></div>
          <div className="Product__info mx-2 my-4">
            <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-4 mb-4">상품정보</h2>
            <table className="border border-gray-400 w-full">
              <tbody>
                {productData?.product?.infos?.map((aInfo) => (
                  <tr key={productData.product.id + aInfo.value}>
                    <td className="bg-gray-200 py-1 pl-2 text-gray-500">{aInfo.key}</td>
                    <td className="numeric-cell py-1 pl-2">{aInfo.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="bg-gray-200 py-1 pl-2 text-gray-500">후팡 상품 번호</td>
                  <td className="numeric-cell py-1 pl-2">{productData.product.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full h-3 bg-gray-300"></div>
          <div className="pb-20">
            <a href="#" className="flex justify-between items-center px-2 py-4 border-b border-gray-400">
              <h3 className="font-bold text-lg">상품평</h3>
              <FontAwesomeIcon //
                icon={faChevronRight}
                className="text-blue-500 font-bold text-lg"
              />
            </a>
            <div className="px-2">
              <div className="flex justify-between py-6">
                <div>
                  {reviewStatus === 'success' && reviewData.reviews.length !== 0 && (
                    <a href="#" className="flex items-center">
                      <div className="mr-1">
                        <StaticRatingStar //
                          count={5}
                          rating={Math.ceil(reviewData.avgRating)}
                          color={{
                            filled: '#ffe259',
                            unfilled: '#DCDCDC',
                          }}
                          className="text-2xl"
                        />
                      </div>
                      <div className="text-lg">{reviewData.totalResults}</div>
                    </a>
                  )}
                </div>
                <a href={`/reviews/write/products/${productId}`} className="text-blue-500">
                  <FontAwesomeIcon icon={faPen} className="mr-1 text-xs" />
                  <span>리뷰 작성하기</span>
                </a>
              </div>

              {reviewStatus === 'success' && reviewData.reviews.length !== 0 && (
                <div className="grid grid-cols-4 gap-1">
                  {reviewData.reviews.map((review) => (
                    <img //
                      src={review.images[0]}
                      alt=""
                      className="object-cover object-center h-28 w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full p-2 bg-white">
            {like || likeList.products.find((product) => product.id === productId) ? (
              <i className="f7-icons cursor-pointer m-3 text-red-500" onClick={unlikeProduct}>
                heart_fill
              </i>
            ) : (
              <i className="f7-icons cursor-pointer m-3 text-gray-500" onClick={likeProduct}>
                heart
              </i>
            )}

            <button
              className="sheet-open border-none focus:outline-none mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
              productData-sheet=".buy"
            >
              구매하기
            </button>
          </div>
          <Sheet
            className="buy p-2 h-52"
            opened={sheetOpened}
            closeByOutsideClick
            onSheetClosed={() => {
              setSheetOpened(false);
            }}
          >
            <h3 className="text-lg font-bold mt-2 truncate">{productData.product.name}</h3>
            <div className="text-red-700 text-sm font-bold my-2">{formmatPrice(productData.product.price)}원</div>
            <Stepper
              value={orderCount}
              onStepperChange={setOrderCount}
              className="my-4 text-gray-300 border-gray-200"
            />
            <div className="flex">
              <button
                className="focus:outline-none outline-none border border-blue-600 text-blue-600 font-bold text-base tracking-normal rounded-md p-2 mr-2"
                onClick={onAddProductToShoppingList}
                disabled={existedProductOnShoppingList(currentUser.id, productId)}
              >
                장바구니에 담기
              </button>
              <button //
                className="outline-none border-none bg-blue-600 text-white font-bold text-base tracking-normal rounded-md p-2 ml-2"
                onClick={onClickBuy}
              >
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
