import React, { useState } from 'react';
import { f7, Navbar, Page, Sheet, Stepper, Swiper, SwiperSlide } from 'framework7-react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { PageRouteProps } from '@constants';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { productKeys } from '@reactQuery/query-keys';
import { deleteProduct, findProductById, likeProductAPI, unlikeProductAPI } from '@api';
import { formmatPrice } from '@utils/index';
import LandingPage from '@pages/landing';
import { saveShoppingList, existedProductOnShoppingList, getShoppingList, IShoppingItem } from '@store';
import useAuth from '@hooks/useAuth';
import { Like } from '@interfaces/like.interface';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { likeListAtom, shoppingListAtom } from '@atoms';
import { UserRole } from '@interfaces/user.interface';

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
  const { currentUser } = useAuth();
  const [sheetOpened, setSheetOpened] = useState(false);
  const [like, setLike] = useState(false);
  const [likeList, setLikeList] = useRecoilState<Like>(likeListAtom);
  const [orderCount, setOrderCount] = useState<number>(1);
  const [items, setItems] = useState([]);
  const setShoppingList = useSetRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const productId = f7route.params.id;

  const { data, status } = useQuery<FindProductByIdOutput, Error>(
    productKeys.detail(productId),
    () => findProductById({ productId }),
    {
      enabled: !!productId,
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
        name: data.product.name,
        price: data.product.price,
        imageUrl: data.product.images[0],
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
      products: [...prev.products, { ...data.product }],
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
      f7.dialog.alert(error?.response?.data || error?.message);
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
      f7.dialog.alert(error?.response?.data || error?.message);
    }
  };

  const onDeleteBtn = async () => {
    try {
      // const ok = await f7.dialog.confirm('정말로 삭제하시겠습니까?');
      const ok = window.confirm('정말 삭제하시겠습니까?');
      if (ok) {
        await deleteProduct({ productId });
        f7router.navigate(`/products?categoryId=${data.product.category.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = () => {
    f7router.navigate('/order', {
      props: {
        items: [data.product.id],
        totalPrice: data.product.price,
      },
    });
  };

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
            <div className="flex my-4">
              <h1 className="text-xl mr-1 truncate">{data.product.name}</h1>
            </div>
            <div className="flex">
              <ProductPrice className="text-red-700 text-xl font-bold">
                {formmatPrice(data.product.price)}원
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
                {data?.product?.infos?.map((aInfo) => (
                  <tr key={data.product.id + aInfo.value}>
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
            <h3 className="text-lg font-bold mt-2 truncate">{data.product.name}</h3>
            <div className="text-red-700 text-sm font-bold my-2">{formmatPrice(data.product.price)}원</div>
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
