import React, { useEffect, useState } from 'react';
import { Navbar, Page } from 'framework7-react';
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, useQueryClient } from 'react-query';

import { PageRouteProps } from '@constants';
import { FindProductByIdOutput } from '@interfaces/product.interface';
import { productKeys, reviewKeys } from '@reactQuery/query-keys';
import { GetReviewsOnProductOutput } from '@interfaces/review.interface';
import StaticRatingStar from '@components/StaticRatingStar';
import { useInView } from 'react-intersection-observer';

interface ReviewListPageProps extends PageRouteProps {
  pHasNextPage: boolean;
  pIsFetching: boolean;
  pIsFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<GetReviewsOnProductOutput, Error>>;
}

const ReviewListPage = ({
  f7route,
  f7router,
  pHasNextPage,
  pIsFetching,
  pIsFetchingNextPage,
  fetchNextPage,
}: ReviewListPageProps) => {
  const [hasNextPage, setHasNextPage] = useState<boolean>(pHasNextPage);
  const [isFetching, setIsFetching] = useState<boolean>(pIsFetching);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(pIsFetchingNextPage);

  const productId = f7route.params.id;
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const queryClient = useQueryClient();
  const productData = queryClient.getQueryData<FindProductByIdOutput>(productKeys.detail(productId));
  const reviewData = queryClient.getQueryData<InfiniteData<GetReviewsOnProductOutput>>(
    reviewKeys.list({ page: 1, productId }),
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage().then((res) => {
        setHasNextPage(res.hasNextPage);
        setIsFetching(res.isFetching);
        setIsFetchingNextPage(res.isFetchingNextPage);
      });
    }
  }, [inView, hasNextPage, isFetching]);

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품리뷰" backLink={true}></Navbar>

      <div className="pb-20">
        <div className="px-4 mb-10">
          <div className="py-6">
            {reviewData.pages.length !== 0 && (
              <div className="flex items-center justify-between">
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
                <div className="text-2xl">{reviewData.pages[0].totalResults}</div>
              </div>
            )}
          </div>

          {reviewData.pages.length !== 0 && (
            <ul className="grid grid-cols-4 gap-1">
              {reviewData.pages[0].reviews.map((review) => (
                <img //
                  src={review.images[0]}
                  alt=""
                  className="object-cover object-center h-28 w-full"
                />
              ))}
            </ul>
          )}
        </div>
        <div className="w-full h-5 bg-gray-200"></div>
        {reviewData.pages.length !== 0 && (
          <>
            <ul>
              {reviewData.pages.map((page, index) => (
                <>
                  {page.reviews.map((review) => (
                    <div className="py-3 px-4 border-b border-gray-300">
                      <div className="flex items-center">
                        <img //
                          src={review.commenter.userImg}
                          alt=""
                          className="object-cover object-center h-16 w-16 mr-3 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-lg">{review.commenter.username}</div>
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
                        </div>
                      </div>
                      <a
                        href={`/products/${productData.product.id}`}
                        className="text-blue-500 my-2 truncate mt-2 w-full"
                      >
                        {productData.product.name}
                      </a>
                      <div className="flex my-2">
                        {review.images.length !== 0 &&
                          review.images.map((
                            image, //
                          ) => (
                            <img //
                              src={image}
                              alt=""
                              className="object-cover object-center h-20 w-20 mr-1"
                            />
                          ))}
                      </div>
                      <p className="h-full">{review.content}</p>
                    </div>
                  ))}
                </>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex justify-center font-bold mt-4">
        <div //
          ref={hasNextPage && !isFetching ? ref : null}
          className=""
        >
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
        </div>
      </div>
      <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full p-2 bg-white">
        <button
          className="sheet-open border-none focus:outline-none mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
          productData-sheet=".buy"
        >
          리뷰 작성하기
        </button>
      </div>
    </Page>
  );
};

export default React.memo(ReviewListPage);
