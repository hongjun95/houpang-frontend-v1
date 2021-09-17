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
import EditProductInfoPage from '@pages/products/edit-product';

import Order from '@pages/orders/order';

import ShoppingListPage from '@pages/shopping-lists/shopping-list';

import LikeListPage from '@pages/likes/like-list';

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
  { path: '/products/:id/edit', component: EditProductInfoPage },
];

const orderPages = [{ path: '/order', component: Order }];

const listPages = [
  { path: '/shopping-list', component: ShoppingListPage },
  { path: '/like-list', component: LikeListPage },
];

const routes: Router.RouteParameters[] = [
  ...commonPages,
  ...userPages,
  ...productPages,
  ...listPages,
  ...orderPages,

  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
