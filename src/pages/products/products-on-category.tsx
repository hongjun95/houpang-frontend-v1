import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useRecoilValue } from 'recoil';

import { getProductsByCategoryId } from '@api';
import { SortState } from '@interfaces/product.interface';
import { GetProductsByCategoryIdOutput } from '@interfaces/category.interface';
import { productKeys } from '@reactQuery/query-keys';
import { IShoppingItem } from '@store';
import { shoppingListAtom } from '@atoms';
import ProductsList from '@components/ProductsList';

interface ProductFilterProps {
  sort: SortState;
}

const ProductsOnCategoryPage = ({ f7route, f7router }) => {
  const [categoryName, setCategoryName] = useState('');
  const shoppingList = useRecoilValue<Array<IShoppingItem>>(shoppingListAtom);

  const { is_main, categoryId }: { is_main: boolean; categoryId: string } = f7route.query;
  const queryClient = useQueryClient();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const filterForm = useFormik<ProductFilterProps>({
    initialValues: {
      sort: 'createdAt desc',
    },

    onSubmit: async () => {
      await queryClient.removeQueries(PRODUCT_KEY);
      await refetch();
    },
  });
  const PRODUCT_KEY = productKeys.list({ sort: filterForm.values.sort, categoryId });

  const {
    fetchNextPage, //
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
    refetch,
  } = useInfiniteQuery<GetProductsByCategoryIdOutput, Error>(
    PRODUCT_KEY, //
    ({ pageParam }) =>
      getProductsByCategoryId({
        categoryId,
        sort: filterForm.values.sort,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
      onSuccess: (data) => {
        setCategoryName(data.pages[data.pages.length - 1].categoryName);
      },
    },
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching]);

  const onRefresh = async (done) => {
    await queryClient.removeQueries(PRODUCT_KEY);
    await refetch();
    done();
  };

  return (
    <Page //
      noToolbar={!is_main}
      onPtrRefresh={onRefresh}
      ptr
    >
      <Navbar backLink={!is_main}>
        <NavTitle>{categoryName || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={shoppingList.length} badgeColor="red" />
        </NavRight>
      </Navbar>
      <ProductsList
        f7router={f7router}
        status={status}
        error={error}
        data={data}
        PRODUCT_KEY={PRODUCT_KEY}
        filterForm={filterForm}
      />
      <div className="flex justify-center font-bold mt-4">
        <div ref={hasNextPage && !isFetching ? ref : null}>
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
        </div>
      </div>
    </Page>
  );
};

export default React.memo(ProductsOnCategoryPage);
