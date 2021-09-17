import { useRecoilState } from 'recoil';
import { AuthState, Token } from '@constants';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';
import { useMe } from './useMe';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = async ({ token, csrf }: Token) => {
    saveToken({ token, csrf });
    const user = await useMe();
    setCurrentUser({ token, csrf, currentUser: user });
  };

  const unAuthenticateUser = () => {
    destroyToken();
    setCurrentUser({ token: '', csrf: '', currentUser: null });
  };

  return {
    ...currentUser,
    authenticateUser,
    unAuthenticateUser,
    isAuthenticated: !!currentUser.token,
  };
};

export default useAuth;
