import { API } from '../api/api.config';

export const useMe = () =>
  API.get('http://localhost:4000/me') //
    .then((res) => res.data)
    .catch((error) => console.error(error));
