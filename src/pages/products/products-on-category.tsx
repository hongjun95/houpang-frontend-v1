import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import { useQuery, useQueryClient } from 'react-query';

import { getProductsByCategoryId } from '@api';
import { currency } from '@js/utils';
import i18n from '../../assets/lang/i18n';
import { Product } from '@interfaces/product.interface';
import { GetProductsByCategoryIdOutput } from '@interfaces/category.interface';
import { productKeys } from '@reactQuery/query-keys';

const OrderStates = [
  ['createdAt desc', '최신순'],
  ['price desc', '높은가격순'],
  ['price asc', '낮은가격순'],
] as const;
type OrderState = typeof OrderStates[number][0];

interface ProductFilterProps {
  order: OrderState;
  categoryId: string;
}

const ProductsOnCategoryPage = ({ f7route, f7router }) => {
  const { is_main, categoryId }: { is_main: boolean; categoryId: string } = f7route.query;
  const [viewType, setViewType] = useState('grid');
  const queryClient = useQueryClient();
  const PRODUCT_KEY = ['products_on_category'];

  // const { data: category } = useQuery<Category, Error>(
  //   ['category', parseInt(category_id, 10)],
  //   getCategory(category_id),
  //   {
  //     enabled: !!category_id,
  //   },
  // );

  const [categoryName, setCategoryName] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (categoryId) {
      (async () => {
        const { ok, error, products, totalResults } = await getProductsByCategoryId({ categoryId });
        if (ok) {
          setProducts(products);
          setTotalCount(totalResults);
          setCategoryName(products[0].category.name);
        }
      })();
    }
  }, []);

  const filterForm = useFormik<ProductFilterProps>({
    initialValues: {
      order: 'createdAt desc',
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
        setCategoryName(products[0].category.name);
      }
    },
  });

  //   const { data, status } = useQuery<Promise<GetProductsByCategoryIdOutput>, Error>(['category', categoryId], () =>
  //   getProductsByCategoryId(categoryId),
  // );

  const { data, refetch } = useQuery<GetProductsByCategoryIdOutput, Error>(
    productKeys.list({ ...filterForm.values }),
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
    setCategoryName(data.products[0].category.name);
    done();
  };

  const onClickLink = (e, productId) => {
    f7router.navigate(`/products/${productId}`, {
      props: {
        productQeuryKey: productKeys.list({ ...filterForm.values }),
      },
    });
  };

  return (
    <Page noToolbar={!is_main} onPtrRefresh={onRefresh} ptr>
      <Navbar backLink={!is_main}>
        <NavTitle>{categoryName || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/line_items" iconF7="cart" iconBadge={3} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((products && totalCount) || 0)}</b>개 상품
        </div>
        <ListInput
          type="select"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          name="order"
          onChange={(e) => {
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.order}
        >
          {map(OrderStates, (v, idx) => (
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
      <List noHairlines className="mt-0 text-sm font-thin ">
        {products && (
          <ul>
            {viewType === 'list'
              ? products.map((product: Product, i) => (
                  <React.Fragment key={product.id}>
                    <ListItem
                      key={product.id}
                      mediaItem
                      onClick={(e) => onClickLink(e, product.id)}
                      // link={`/products/${product.id}/${categoryId}`}
                      title={`${product.name}-${product.id}`}
                      subtitle={`${currency(product.price)}원`}
                      className="w-full"
                    >
                      <img slot="media" src={product.images[0]} className="w-20 rounded" alt="" />
                    </ListItem>
                  </React.Fragment>
                ))
              : products.map((product: Product, i) => (
                  <React.Fragment key={product.id}>
                    <div className="w-1/2 inline-flex grid-list-item relative">
                      <ListItem
                        mediaItem
                        onClick={(e) => onClickLink(e, product.id)}
                        // link={`/products/${product.id}/${categoryId}`}
                        title={`${product.name}-${product.id}`}
                        subtitle={`${currency(product.price)}원`}
                        header={categoryId ? categoryName : ''}
                        className="w-full"
                      >
                        <img
                          slot="media"
                          alt=""
                          src={product.images[0]}
                          className="w-40 m-auto radius rounded shadow"
                        />
                      </ListItem>
                    </div>
                  </React.Fragment>
                ))}
          </ul>
        )}
      </List>
    </Page>
  );
};

export default React.memo(ProductsOnCategoryPage);
