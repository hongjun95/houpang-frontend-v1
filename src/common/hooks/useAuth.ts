import { useRecoilState } from 'recoil';
import { AuthState, Token } from '@constants';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';
import { useMe } from './useMe';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = async ({ token, csrf }: Token) => {
    if (token === null) {
      return new Error();
    }
    saveToken({ token, csrf });
    const user = await useMe();
    setCurrentUser({ token, csrf, currentUser: user });
  };

  const unAuthenticateUser = () => {
    destroyToken();
    setCurrentUser({ token: null, csrf: null, currentUser: null });
  };

  return {
    ...currentUser,
    authenticateUser,
    unAuthenticateUser,
    isAuthenticated: !!currentUser.token,
  };
};

export default useAuth;
