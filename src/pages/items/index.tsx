import { API_URL, getCategory, getItems } from '@api';
import { Item } from '@constants';
import { currency } from '@js/utils';
import { useFormik } from 'formik';
import { Link, List, ListInput, ListItem, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import i18n from '../../assets/lang/i18n';

const SortStates = [
  ['created_at desc', '최신순'],
  ['sale_price desc', '높은가격순'],
  ['sale_price asc', '낮은가격순'],
] as const;
type SortState = typeof SortStates[number][0];

interface ItemFilterProps {
  s: SortState;
  category_id_eq: string;
}

const ItemIndexPage = ({ f7route }) => {
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

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    // then을 사용
    if (category_id) {
      getCategory(category_id).then((resp) => {
        setCategory(resp.data);
      });
    }
    // async await 을 사용
    // (async () => {
    //   const { data } = await getItems();
    //   setItems(data.items);
    // })();
  }, []);

  const filterForm = useFormik<ItemFilterProps>({
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
        <NavTitle>{(category && category.title) || '쇼핑'}</NavTitle>
        <NavRight>
          <Link href="/line_items" iconF7="cart" iconBadge={3} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((items && totalCount) || 0)}</b>개 상품
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
        {items && (
          <ul>
            {viewType === 'list'
              ? items.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      key={item.id}
                      mediaItem
                      link={`/items/${item.id}`}
                      title={`${item.id}-${item.name}`}
                      subtitle={`${currency(item.sale_price)}원`}
                      className="w-full"
                    >
                      <img slot="media" src={API_URL + item.image_path} className="w-20 rounded" alt="" />
                    </ListItem>
                  </React.Fragment>
                ))
              : items.map((item: Item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="w-1/2 inline-flex grid-list-item relative">
                      <ListItem
                        mediaItem
                        link={`/items/${item.id}`}
                        title={`${item.id}-${item.name}`}
                        subtitle={`${currency(item.sale_price)}원`}
                        header={category_id ? category?.title : ''}
                        className="w-full"
                      >
                        <img
                          slot="media"
                          alt=""
                          src={API_URL + item.image_path}
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

export default React.memo(ItemIndexPage);
