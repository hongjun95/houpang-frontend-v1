import React, { memo, useState } from 'react';
import { Link, List, ListInput } from 'framework7-react';
import { InfiniteData } from 'react-query';
import { Router } from 'framework7/types';
import { map } from 'lodash';

import { GetProductsBySearchTermOutput, Product, SortStates } from '@interfaces/product.interface';
import LandingPage from '@pages/landing';
import { formmatPrice } from '@utils/index';
import StaticRatingStar from './StaticRatingStar';
import { GetProductsByCategoryIdOutput } from '@interfaces/category.interface';
import { currency } from '@js/utils';
import i18n from '../assets/lang/i18n';

interface ProductListProps {
  status: 'idle' | 'error' | 'loading' | 'success';
  error: Error;
  data: InfiniteData<GetProductsBySearchTermOutput | GetProductsByCategoryIdOutput>;
  f7router: Router.Router;
  PRODUCT_KEY: any;
  filterForm: any;
}

export type ViewType = 'grid' | 'list';

const ProductsList = ({ status, error, data, f7router, PRODUCT_KEY, filterForm }: ProductListProps) => {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const onClickLink = (e, productId) => {
    f7router.navigate(`/products/${productId}`, {
      props: {
        productQeuryKey: PRODUCT_KEY,
      },
    });
  };

  return (
    <>
      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency(data?.pages[0].totalResults || 0)}</b>개 상품
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
      {status === 'loading' ? (
        <LandingPage />
      ) : status === 'error' ? (
        <span>Error:{error.message}</span>
      ) : (
        <List noHairlines className="mt-0 text-sm font-thin">
          {viewType === 'grid' ? (
            <ul className="flex-wrap grid grid-cols-2">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.products.map((product: Product) => (
                    <div className="relative" key={product.id}>
                      <Link className="block m-1" onClick={(e) => onClickLink(e, product.id)}>
                        <div
                          className="bg-gray-100 py-32 bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${product.images[0]})`,
                          }}
                        ></div>
                        <div className="m-1">
                          <div className="font-bold mt-1 truncate">{product.name}</div>
                          <div className="text-red-700 text-xl font-bold">{formmatPrice(product.price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(product.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({product.reviews.length})</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.products.map((product: Product) => (
                    <div>
                      <a className="flex gap-1 m-1" onClick={(e) => onClickLink(e, product.id)} key={product.id}>
                        <img src={product.images[0]} alt="" className="w-1/4 h-40 mr-4" />
                        <div className="w-3/4">
                          <div className="text-xl font-bold mt-1 line-clamp-2">{product.name}</div>
                          <div className="text-red-700 text-2xl mb-6 font-bold">{formmatPrice(product.price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(product.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({product.reviews.length})</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
        </List>
      )}
    </>
  );
};

export default memo(ProductsList);
