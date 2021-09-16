import { atom } from 'recoil';
import { AuthState } from '@constants';
import { Like } from '@interfaces/like.interface';
import { IShoppingItem } from '@store';

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
  key: 'productImgFilesAtom',
  default: [],
});

export const orderListAtom = atom({
  key: 'orderListAtom',
  default: [],
});

export const likeListAtom = atom<Like>({
  key: 'likeListAtom',
  default: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    id: '',
    products: [],
  },
});

export const shoppingListAtom = atom<Array<IShoppingItem>>({
  key: 'shoppingListAtom',
  default: [],
});
