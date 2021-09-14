import { TOKEN_KEY, CSRF_KEY, Token, SHOPPING_LIST } from '@constants';

export const getToken = (): Token => ({
  csrf: window.localStorage.getItem(CSRF_KEY),
  token: window.localStorage.getItem(TOKEN_KEY),
});

export const saveToken = ({ token, csrf }: Token) => {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(CSRF_KEY, csrf);
};

export const destroyToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(CSRF_KEY);
};

export const getShoppingList = () => JSON.parse(localStorage.getItem(SHOPPING_LIST)) || [];
export const existedProductOnShoppingList = (productId: string) =>
  getShoppingList().find((aProductId: string) => aProductId === productId);
export const addProductToShoppingList = (shoppingList: Array<string>) => {
  localStorage.setItem(SHOPPING_LIST, JSON.stringify(shoppingList));
};

export default { getToken, saveToken, destroyToken };
