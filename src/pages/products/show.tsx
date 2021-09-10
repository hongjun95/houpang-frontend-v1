import { PageRouteProps } from '@constants';
import { Navbar, Page, Swiper, SwiperSlide } from 'framework7-react';
import React from 'react';

const ItemShowPage = ({ f7route, f7router }: PageRouteProps) => {
  const onClickBack = () => {
    f7router.back();
  };

  return (
    <Page noToolbar>
      <Navbar title="상품상세" backLink={true}></Navbar>

      <h1>게시글 상세 페이지</h1>

      <a href="#" onClick={onClickBack}>
        뒤로가기
      </a>

      <Swiper pagination navigation scrollbar>
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </Page>
  );
};

export default ItemShowPage;
