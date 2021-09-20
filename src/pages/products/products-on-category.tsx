import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import { useQuery, useQueryClient } from 'react-query';

import { getProductsByCategoryId } from '@api';
import { currency } from '@js/utils';
import i18n from '../../assets/lang/i18n';
import { Product, SortState, SortStates } from '@interfaces/product.interface';
import { GetProductsByCategoryIdOutput } from '@interfaces/category.interface';
import { productKeys } from '@reactQuery/query-keys';
import { formmatPrice } from '@utils/index';
import { getShoppingList } from '@store';
import useAuth from '@hooks/useAuth';

interface ProductFilterProps {
  sort: SortState;
  categoryId: string;
}

const ProductsOnCategoryPage = ({ f7route, f7router }) => {
  const { currentUser } = useAuth();
  const shoppingList = getShoppingList(currentUser?.id);
  const { is_main, categoryId }: { is_main: boolean; categoryId: string } = f7route.query;
  const [viewType, setViewType] = useState('grid');
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (categoryId) {
      (async () => {
        const { ok, products, totalResults, categoryName } = await getProductsByCategoryId({ categoryId });
        if (ok) {
          setProducts(products);
          setTotalCount(totalResults);
          setCategoryName(categoryName);
        }
      })();
    }
  }, []);

  const filterForm = useFormik<ProductFilterProps>({
    initialValues: {
      sort: 'createdAt desc',
      categoryId,
    },

    onSubmit: async () => {
      await queryClient.removeQueries(PRODUCT_KEY);
      const {
        data: { ok, products, totalResults },
      } = await refetch();
      if (ok) {
        setProducts(products);
        setTotalCount(totalResults);
        setCategoryName(categoryName);
      }
    },
  });
  const PRODUCT_KEY = productKeys.list({ ...filterForm.values });

  //   const { data, status } = useQuery<Promise<GetProductsByCategoryIdOutput>, Error>(['category', categoryId], () =>
  //   getProductsByCategoryId(categoryId),
  // );

  const { data, refetch } = useQuery<GetProductsByCategoryIdOutput, Error>(
    PRODUCT_KEY,
    () => getProductsByCategoryId({ ...filterForm.values }),
    {
      enabled: !!categoryId,
    },
  );

  const onRefresh = async (done) => {
    await queryClient.removeQueries(PRODUCT_KEY);
    const { data } = await refetch();
    setProducts(data.products);
    setTotalCount(data.totalResults);
    setCategoryName(data.categoryName);
    done();
  };

  const onClickLink = (e, productId) => {
    f7router.navigate(`/products/${productId}`, {
      props: {
        productQeuryKey: PRODUCT_KEY,
      },
    });
  };

  return (
    <Page noToolbar={!is_main} onPtrRefresh={onRefresh} ptr>
      <Navbar backLink={!is_main}>
        <NavTitle>{categoryName || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={shoppingList.length} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((products && totalCount) || 0)}</b>개 상품
        </div>
        <ListInput
          type="select"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          name="sort"
          onChange={(e) => {
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.sort}
        >
          {map(SortStates, (v, idx) => (
            <option value={v[0]} key={idx}>
              {v[1]}
            </option>
          ))}
        </ListInput>
        <ListInput
          type="select"
          defaultValue="grid"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          onChange={(e) => setViewType(e.target.value)}
        >
          {map(i18n.t('ui'), (v, k) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </ListInput>
      </form>
      <List noHairlines className="mt-0 text-sm font-thin">
        {products && viewType === 'list' ? (
          <ul className="flex flex-col">
            {products.map((product: Product) => (
              <a className="flex m-1 w-full" onClick={(e) => onClickLink(e, product.id)} key={product.id}>
                <div
                  className="bg-gray-100 w-40 h-48 bg-center bg-cover relative left-0"
                  style={{
                    backgroundImage: `url(${product.images[0]})`,
                  }}
                ></div>
                <div className="ml-2 mt-4">
                  <div className="text-xl font-bold mt-1 truncate">{product.name}</div>
                  <div className="text-red-700 text-2xl mb-6 font-bold">{formmatPrice(product.price)}원</div>
                  <div>review stars(review number)</div>
                </div>
              </a>
            ))}
          </ul>
        ) : (
          <ul className="flex-wrap grid grid-cols-2">
            {products.map((product: Product, i) => (
              <div className="relative" key={product.id}>
                <Link className="block m-1" onClick={(e) => onClickLink(e, product.id)}>
                  <div
                    className="bg-gray-100 py-32 bg-center bg-cover"
                    style={{
                      backgroundImage: `url(${product.images[0]})`,
                    }}
                  ></div>
                  <div className="m-1">
                    <div className="font-bold mt-1">{product.name}</div>
                    <div className="text-red-700 text-xl font-bold">{formmatPrice(product.price)}원</div>
                    <div>review stars(review number)</div>
                  </div>
                </Link>
              </div>
            ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ProductsOnCategoryPage);
