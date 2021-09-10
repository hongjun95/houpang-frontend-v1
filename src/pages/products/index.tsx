import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { API_URL, getProductsByCategoryId } from '@api';
import { currency } from '@js/utils';
import i18n from '../../assets/lang/i18n';
import { Product } from '@interfaces/product.interface';

const SortStates = [
  ['created_at desc', '최신순'],
  ['sale_price desc', '높은가격순'],
  ['sale_price asc', '낮은가격순'],
] as const;
type SortState = typeof SortStates[number][0];

interface ProductFilterProps {
  s: SortState;
  category_id_eq: string;
}

const ProductIndexPage = ({ f7route }) => {
  const { is_main, category_id } = f7route.query;
  const [viewType, setViewType] = useState('grid');
  // const queryClient = useQueryClient();
  // const ITEM_KEY = ['items', category_id * 1];
  // const { data: category } = useQuery<Category, Error>(
  //   ['category', parseInt(category_id, 10)],
  //   getCategory(category_id),
  //   {
  //     enabled: !!category_id,
  //   },
  // );
  const [category, setCategory] = useState(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    // then을 사용
    // if (category_id) {
    //   getCategory(category_id).then((resp) => {
    //     setCategory(resp.data);
    //   });
    // }
    // async await 을 사용
    (async () => {
      const { ok, error, products, totalPages, totalResults } = await getProductsByCategoryId(category_id);
      if (ok) {
        setProducts(products);
        setTotalCount(totalResults);
      }
    })();
  }, []);

  const filterForm = useFormik<ProductFilterProps>({
    initialValues: {
      s: 'created_at desc',
      category_id_eq: category_id,
    },
    onSubmit: async () => {
      // await queryClient.removeQueries(ITEM_KEY);
      // await refetch();
    },
  });

  // const { data, refetch } = useQuery<Items, Error>(
  //   ITEM_KEY,
  //   getItems({
  //     q: filterForm.values,
  //   }),
  // );

  const onRefresh = async (done) => {
    // await queryClient.removeQueries(ITEM_KEY);
    // await refetch();
    done();
  };

  return (
    <Page noToolbar={!is_main} onPtrRefresh={onRefresh} ptr>
      <Navbar backLink={!is_main}>
        <NavTitle>{(category && category.name) || '쇼핑'}</NavTitle>
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
          name="s"
          onChange={(e) => {
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.s}
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
      <List noHairlines className="mt-0 text-sm font-thin ">
        {products && (
          <ul>
            {viewType === 'list'
              ? products.map((product: Product, i) => (
                  <React.Fragment key={product.id}>
                    <ListItem
                      key={product.id}
                      mediaItem
                      link={`/items/${product.id}`}
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
                        link={`/items/${product.id}`}
                        title={`${product.name}-${product.id}`}
                        subtitle={`${currency(product.price)}원`}
                        header={category_id ? category?.name : ''}
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

export default React.memo(ProductIndexPage);
