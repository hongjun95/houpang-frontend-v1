import { Category, Token } from '@constants';
import { getToken } from '@store';
import { AxiosResponse } from 'axios';
import { GetAllCategoriesOutput } from 'src/interfaces/category.interface';
import { LoginOutput, SignUpOutput } from 'src/interfaces/user.interface';
import { PlainAPI, API, VERSION, API_URL } from './api.config';
import { ApiService } from './api.service';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);
export const signupAPI = async (data: any) => {
  let response: AxiosResponse<SignUpOutput>;
  try {
    response = await PlainAPI.post<SignUpOutput>('/signup', {
      data,
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const loginAPI = async (data: any) => {
  let response: AxiosResponse<LoginOutput>;
  try {
    response = await PlainAPI.post('/login', {
      data,
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const logoutAPI = () => API.delete('/logout');

export const {
  query: getItems,
  get: getItem,
  create: createItem,
  update: updateItem,
  destroy: destroyItem,
} = ApiService('items');

// export const { query: getUsers, get: getUser } = ApiService('users');
// export const { query: getCategories, get: getCategory } = ApiService('categories');

// export const getItems = (params = null) => API.get<any>('/items', { params });
export const getCategories = async () => {
  let response: AxiosResponse<GetAllCategoriesOutput>;
  try {
    response = await PlainAPI.get<GetAllCategoriesOutput>('/categories');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;

  // return API.get<Category[]>('/categories');
};
export const getCategory = (id, params = null) => API.get<Category>(`/categories/${id}`, { params });

export const getPosts = () => async (params = null) => {
  const { data } = await API.get('/posts', { params });
  return data;
};
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });
export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });
export const destroyPost = (postId) => API.delete(`/posts/${postId}`);

export { API_URL, VERSION };
