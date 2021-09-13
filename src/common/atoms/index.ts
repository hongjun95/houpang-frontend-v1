import { atom } from 'recoil';
import { AuthState } from '@constants';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: initialAuthState,
});

export const productNameAtom = atom<string>({
  key: 'productNameAtom',
  default: '',
});

export const productPriceAtom = atom<number>({
  key: 'productPriceAtom',
  default: 0,
});

export const productCategoryNameAtom = atom<string>({
  key: 'productCategoryNameAtom',
  default: '',
});

export const productStockAtom = atom<number>({
  key: 'productStockAtom',
  default: 0,
});

export const productImgFilesAtom = atom<File[]>({
  key: 'productImgFileAtom',
  default: [],
});
