import { Token } from '@constants';
import { getToken } from '@store';
import { AxiosResponse } from 'axios';
import {
  GetAllCategoriesOutput,
  GetProductsByCategoryIdInput,
  GetProductsByCategoryIdOutput,
} from 'src/interfaces/category.interface';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
  EditProfileInput,
  EditProfileOutput,
  SignInInput,
  SignInOutput,
  SignUpInput,
  SignUpOutput,
} from 'src/interfaces/user.interface';
import { PlainAPI, API, VERSION, API_URL } from './api.config';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);

// user APIs

export const signupAPI = async (data: SignUpInput) => {
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

export const loginAPI = async (data: SignInInput) => {
  let response: AxiosResponse<SignInOutput>;
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

export const editProfileAPI = async (data: EditProfileInput) => {
  let response: AxiosResponse<EditProfileOutput>;
  try {
    response = await API.post('/edit-profile', {
      data,
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const changePasswordAPI = async (data: ChangePasswordInput) => {
  let response: AxiosResponse<ChangePasswordOutput>;
  try {
    response = await API.post('/change-password', {
      data,
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};

export const logoutAPI = () => API.delete('/logout');

// export const {
//   query: getItems,
//   get: getItem,
//   create: createItem,
//   update: updateItem,
//   destroy: destroyItem,
// } = ApiService('items');

// export const { query: getUsers, get: getUser } = ApiService('users');
// export const { query: getCategories, get: getCategory } = ApiService('categories');

// item APIs
// export const getItemsOnCategory = async (id: string) => {
//   let response: AxiosResponse<GetProductsOnCategoryOutput>;
//   try {
//     response = await API.get<GetProductsOnCategoryOutput>(`/categories/products/${id}`);
//   } catch (error) {
//     console.error(error);
//   }
//   const result = response.data;
//   return result;
// };
export const getProductsByCategoryId = async ({
  categoryId,
  order = 'createdAt desc',
  page = 1,
}: GetProductsByCategoryIdInput): Promise<GetProductsByCategoryIdOutput> => {
  let response: AxiosResponse<GetProductsByCategoryIdOutput>;
  try {
    response = await API.get<GetProductsByCategoryIdOutput>(`/categories/${categoryId}`, {
      params: {
        order,
        page,
      },
    });
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
export const getCategories = async () => {
  let response: AxiosResponse<GetAllCategoriesOutput>;
  try {
    response = await PlainAPI.get<GetAllCategoriesOutput>('/categories');
  } catch (error) {
    console.error(error);
  }
  const result = response.data;
  return result;
};
// export const getCategory = (slug: string) => API.get<GetAllCategoriesOutput>(`/products/${slug}`);

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
