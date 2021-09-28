import { Router } from 'framework7/types';

import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';

import SignUpPage from '@pages/users/signUp';
import LoginPage from '@pages/users/signIn';
import MyPage from '@pages/users/myPage';
import EditProfilePage from '@pages/users/editProfile';
import ChangePassword from '@pages/users/changePassword';

import ProductsOnCategoryPage from '@pages/products/products-on-category';
import ProductDetailPage from '@pages/products/product-detail';
import AddProductPage from '@pages/products/add-product';
import AddProductInfoPage from '@pages/products/add-product-info';
import ManageProductsPage from '@pages/products/manage-products';
import EditProductPage from '@pages/products/edit-product';
import EditProductInfoPage from '@pages/products/edit-product-info';

import OrderPage from '@pages/orders/order';
import OrderListPage from '@pages/orders/order-list';

import SelectProdcutPage from '@pages/refunds/select-product';
import SelectReasonPage from '@pages/refunds/select-reason';
import SelectSolutionPage from '@pages/refunds/select-solution';
import RefundListPage from '@pages/refunds/refund-list';

import ShoppingListPage from '@pages/shopping-lists/shopping-list';

import CreateReviewPage from '@pages/reviews/create-review';

import PostIndexPage from '@pages/posts/index';
import PostShowPage from '@pages/posts/show';
import PostNewPage from '@pages/posts/new';
import PostEditPage from '@pages/posts/edit';

const commonPages = [
  { path: '/', component: HomePage },
  {
    path: '/intro', //
    component: IntroPage,
  },
];

const userPages = [
  {
    path: '/users/sign_up',
    component: SignUpPage,
  },
  {
    path: '/users/sign_in',
    component: LoginPage,
  },
  { path: '/mypage', component: MyPage },
  { path: '/users/edit-profile', component: EditProfilePage },
  { path: '/users/change-password', component: ChangePassword },
];

const productPages = [
  { path: '/products', component: ProductsOnCategoryPage },
  { path: '/products/add', component: AddProductPage },
  { path: '/products/add-info', component: AddProductInfoPage },
  { path: '/products/manage', component: ManageProductsPage },
  { path: '/products/:id', component: ProductDetailPage },
  { path: '/products/:id/edit', component: EditProductPage },
  { path: '/products/:id/edit-info', component: EditProductInfoPage },
];

const orderPages = [
  { path: '/order', component: OrderPage },
  { path: '/orders', component: OrderListPage },
];

const refundPages = [
  { path: '/orders/:orderItemId/refund/select-product', component: SelectProdcutPage },
  { path: '/orders/:orderItemId/refund/select-reason', component: SelectReasonPage },
  { path: '/orders/:orderItemId/refund/select-solution', component: SelectSolutionPage },
  { path: '/refunds', component: RefundListPage },
];

const listPages = [{ path: '/shopping-list', component: ShoppingListPage }];

const reviewPages = [
  // { path: '/reviews', component: ProductsOnCategoryPage },
  { path: '/reviews/write/products/:id', component: CreateReviewPage },
  // { path: '/reviews/add-info', component: AddProductInfoPage },
  // { path: '/reviews/manage', component: ManageProductsPage },
  // { path: '/reviews/:id', component: ProductDetailPage },
  // { path: '/reviews/:id/edit', component: EditProductPage },
  // { path: '/reviews/:id/edit-info', component: EditProductInfoPage },
];

const routes: Router.RouteParameters[] = [
  ...commonPages,
  ...userPages,
  ...productPages,
  ...listPages,
  ...orderPages,
  ...refundPages,
  ...reviewPages,

  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
