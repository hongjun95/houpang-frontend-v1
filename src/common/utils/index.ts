import jwt_decode from 'jwt-decode';
import { TokenPayload } from '@constants';
import axios, { AxiosResponse } from 'axios';
import { configs } from '@config';
import { User } from 'src/interfaces/user.interface';
import { useMe } from '@hooks/useMe';

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const getCurrentUserFromToken = async (token: string) => {
  const data: AxiosResponse<User> = await useMe();
  console.log(data);
  return data;
};
