import { TOKEN_KEY } from '@constants';
import { getToken } from '@store';
import axios from 'axios';

const headerConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': `v1`,
    Authorization: getToken().token ? `Bearer ${getToken().token}` : '',
    withCredentials: true,
  },
};

export const useMe = () => axios.get('http://localhost:4000/me', headerConfig);
