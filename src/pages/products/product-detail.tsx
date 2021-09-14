import React from 'react';
import { Navbar, Page, Swiper, SwiperSlide } from 'framework7-react';
import { useQueryClient } from 'react-query';

import { DetailPageProps } from '@constants';
import { GetProductsByCategoryIdOutput } from '@interfaces/category.interface';

const ItemShowPage = ({ f7route, f7router, productQeuryKey }: DetailPageProps) => {
  const onClickBack = () => {
    f7router.back();
  };

  const queryClient = useQueryClient();
  const { ok, error, products, totalPages, totalResults } = queryClient.getQueryData<GetProductsByCategoryIdOutput>(
    productQeuryKey,
  );

  const productId = f7route.params.id;
  const product = products.find((product) => product.id === productId);
  console.log(product);

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품상세" backLink={true}></Navbar>

      <Swiper pagination className="h-3/4">
        {product &&
          product.images.map((imageUrl) => (
            <SwiperSlide key={Date.now() + imageUrl}>
              <img src={imageUrl} alt="" className="h-full w-full" />
            </SwiperSlide>
          ))}
      </Swiper>
      <div>
        <div>
          <div>brand image</div>
          <div>brand name</div>
        </div>
        <div>review stars (review number)</div>
      </div>
      <h1>product name</h1>
      <div>Select info option</div>
      <div>price</div>
    </Page>
  );
};

export default ItemShowPage;
