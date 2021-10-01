import React, { useState } from 'react';
import styled from 'styled-components';
import { f7, Link, Navbar, Page, Sheet, Stepper, Swiper, SwiperSlide } from 'framework7-react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { PageRouteProps } from '@constants';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { Like } from '@interfaces/like.interface';
import { UserRole } from '@interfaces/user.interface';
import { GetReviewsOnProductOutput } from '@interfaces/review.interface';
import { productKeys, reviewKeys } from '@reactQuery/query-keys';
import { deleteProduct, findProductById, getReviewOnProductAPI, likeProductAPI, unlikeProductAPI } from '@api';
import { formmatPrice } from '@utils/index';
import { saveShoppingList, existedProductOnShoppingList, getShoppingList, IShoppingItem } from '@store';
import { likeListAtom, shoppingListAtom } from '@atoms';
import LandingPage from '@pages/landing';
import useAuth from '@hooks/useAuth';
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

  const {
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data: reviewData,
    error,
    status: reviewStatus,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<GetReviewsOnProductOutput, Error>(
    reviewKeys.list({ productId, page: 1 }),
    ({ pageParam }) =>
      getReviewOnProductAPI({
        productId,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
    },
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
        orderCount,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(currentUser.id, shoppingList);
      setShoppingList(shoppingList);
      f7.dialog.confirm('장바구니로 가시겠습니가?', () => {
        f7router.navigate('/shopping-list');
      });
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
      await f7.dialog.confirm('정말로 삭제하시겠습니까?', async () => {
        await deleteProduct({ productId });
        f7router.navigate(`/products?categoryId=${productData.product.category.id}`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = () => {
    f7router.navigate('/order', {
      props: {
        orderList: [
          {
            id: productData.product.id,
            imageUrl: productData.product.images[0],
            name: productData.product.name,
            orderCount,
            price: productData.product.price,
          },
        ],
        totalPrice: productData.product.price,
      },
    });
  };

  const onClickLink = (e: any) => {
    f7router.navigate(`/reviews/products/${productId}`, {
      props: {
        pHasNextPage: hasNextPage,
        pIsFetching: isFetching,
        pIsFetchingNextPage: isFetchingNextPage,
        fetchNextPage,
        refetch,
      },
    });
  };

  const onClickWriteReviewLink = (e: any) => {
    f7router.navigate(`/reviews/write/products/${productId}`, {
      props: {
        refetch,
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
              <div className="flex items-center justify-center w-32">
                <img className="rounded-full mr-2 object-cover w-10 h-10" src={productData.product.provider.userImg} />
                <div className="w-full">
                  <div>{productData.product.provider.username}</div>
                  <div className="text-gray-400 text-sm">브랜드</div>
                </div>
              </div>
              {reviewStatus === 'error' ? (
                <span>Error : {error.message}</span>
              ) : (
                reviewStatus === 'success' && (
                  <button onClick={onClickLink} className="flex items-center outline-none">
                    <div className="mr-1">
                      <StaticRatingStar //
                        count={5}
                        rating={Math.ceil(reviewData.pages[0].avgRating)}
                        color={{
                          filled: '#ffe259',
                          unfilled: '#DCDCDC',
                        }}
                        className="text-xl"
                      />
                    </div>
                    <div className="text-blue-500 text-base mb-1">({reviewData.pages[0].totalResults})</div>
                  </button>
                )
              )}
            </div>
            <div className="flex my-4">
              <h1 className="text-xl mr-1 truncate">{productData.product.name}</h1>
            </div>
            <div className="flex">
              <ProductPrice className="text-red-700 text-xl font-bold">
                {formmatPrice(productData.product.price)}원
              </ProductPrice>
              {currentUser.id === productData.product.provider.id && currentUser.role === UserRole.Provider && (
                <>
                  <ProductEditLink
                    className="block w-2 py-1 text-center text-white bg-blue-600 rounded-md mr-2"
                    href={`/products/${productId}/edit`}
                  >
                    수정
                  </ProductEditLink>
                  <ProductDeleteBtn
                    className="block w-2 py-1 text-center text-white bg-red-600 rounded-md"
                    onClick={onDeleteBtn}
                  >
                    삭제
                  </ProductDeleteBtn>
                </>
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
            <button
              onClick={onClickLink}
              className="flex justify-between items-center px-4 py-4 border-b border-gray-400 outline-none"
            >
              <h3 className="font-bold text-lg">상품평</h3>
              <FontAwesomeIcon //
                icon={faChevronRight}
                className="text-blue-500 font-bold text-lg"
              />
            </button>
            <div className="px-4 mb-10">
              <div className="flex justify-between py-6">
                <div>
                  {reviewStatus === 'error' ? (
                    <span>Error : {error.message}</span>
                  ) : (
                    reviewStatus === 'success' && (
                      <div className="flex items-center">
                        <div className="mr-1">
                          <StaticRatingStar //
                            count={5}
                            rating={Math.ceil(reviewData.pages[0].avgRating)}
                            color={{
                              filled: '#ffe259',
                              unfilled: '#DCDCDC',
                            }}
                            className="text-2xl"
                          />
                        </div>
                        <div className="text-lg">{reviewData.pages[0].totalResults}</div>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <button onClick={onClickWriteReviewLink} className="outline-none text-blue-500">
                    <FontAwesomeIcon icon={faPen} className="mr-1 text-xs" />
                    <span>리뷰 작성하기</span>
                  </button>
                </div>
              </div>

              {reviewStatus === 'error' ? (
                <span>Error : {error.message}</span>
              ) : (
                reviewStatus === 'success' &&
                reviewData.pages[0].reviews.length !== 0 && (
                  <>
                    <div className="grid grid-cols-4 gap-1">
                      {reviewData.pages[0].reviews.map((review) => (
                        <img //
                          key={review.id + review.images[0]}
                          src={review.images[0]}
                          alt=""
                          className="object-cover object-center h-28 w-full"
                        />
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
            <div className="w-full h-5 bg-gray-200"></div>
            {reviewStatus === 'error' ? (
              <span>Error : {error.message}</span>
            ) : (
              reviewStatus === 'success' &&
              reviewData.pages[0].reviews.length !== 0 && (
                <>
                  <div>
                    {reviewData.pages[0].reviews.map((review) => (
                      <a key={review.id} href="#" className="block py-3 px-4 border-b border-gray-300">
                        <div className="font-semibold">{review.commenter.username}</div>
                        <div className="flex items-center my-1">
                          <div className="mr-1">
                            <StaticRatingStar //
                              count={5}
                              rating={Math.ceil(review.rating)}
                              color={{
                                filled: '#ffe259',
                                unfilled: '#DCDCDC',
                              }}
                              className="text-lg"
                            />
                          </div>
                          <div className="text-sm">{review.reviewedAt}</div>
                        </div>
                        <div className="flex">
                          <img //
                            src={review.images[0]}
                            alt=""
                            className="object-cover object-center h-24 w-24 mr-1"
                          />
                          <p className="line-clamp-4 ml-2 h-full">{review.content}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="border-2 border-blue-500 text-blue-500 font-semibold mx-4 flex justify-center py-2 mb-2 mt-4">
                    <button onClick={onClickLink} className="outline-none">
                      이 상품의 상품평 모두보기
                    </button>
                  </div>
                </>
              )
            )}
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
              data-sheet=".buy"
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
            <div className="flex justify-between">
              <h3 className="text-lg font-bold mt-2 truncate">{productData.product.name}</h3>
              <Link sheetClose>
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </Link>
            </div>
            <div className="text-red-700 text-sm font-bold my-2">{formmatPrice(productData.product.price)}원</div>
            <Stepper
              value={orderCount}
              onStepperChange={setOrderCount}
              className="my-4 text-gray-300 border-gray-200"
            />
            <div className="flex">
              <button
                className={`outline-none border font-bold text-base tracking-normal rounded-md p-2 mr-2 ${
                  existedProductOnShoppingList(currentUser.id, productId)
                    ? 'border-gray-300 text-gray-300 pointer-events-none'
                    : 'border-blue-600 text-blue-600'
                }`}
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
