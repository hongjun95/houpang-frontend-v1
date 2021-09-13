import React from 'react';
import { Router } from 'framework7/types';

import packageJson from '../../../package.json';
import { User } from 'src/interfaces/user.interface';
export * from './schema';

/** 리터럴 혹은 불변 객체 */
export const TOKEN_KEY = `${packageJson.name}_TOKEN`;
export const CSRF_KEY = `${packageJson.name}_CSRF`;

export const ACTIONS = {
  NEW: 'new',
  INDEX: 'index',
  EDIT: 'edit',
  SHOW: 'show',
};

export const DEFAULT_ACTIONS = Object.values(ACTIONS);

/** 인터페이스 */
/* User Auth Interfaces */
export interface Token {
  token: null | string;
  csrf: null | string;
}

export interface AuthState extends Token {
  // isLoading: boolean;
  currentUser: User; // TODO currentUser 인터페이스화
}

export interface TokenPayload {
  user: any; // TODO IToknePayload any 타입 변경
}
// Shared

export interface PageRouteProps {
  f7route: Router.Route;
  f7router: Router.Router;
}

export interface DetailPageProps extends PageRouteProps {
  productQeuryKey: Array<string>;
}

export interface Address {
  zipcode: string;
  address1: string;
  address2?: string;
}
