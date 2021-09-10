import { TOKEN_KEY } from '@constants';
import axios from 'axios';

const token = localStorage.getItem(TOKEN_KEY);
const headerConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': `v1`,
    Authorization: token ? `Bearer ${token}` : '',
    withCredentials: true,
  },
};

export const useMe = () => axios.get('http://localhost:4000/me', headerConfig);
