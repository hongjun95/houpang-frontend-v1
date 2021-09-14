import { AxiosResponse } from 'axios';
import { User } from 'src/interfaces/user.interface';
import { useMe } from '@hooks/useMe';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const getCurrentUserFromToken = async (token: string) => {
  const data: AxiosResponse<User> = await useMe();
  console.log(data);
  return data;
};

export const formmatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
