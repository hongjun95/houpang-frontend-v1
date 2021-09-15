import { useRecoilState } from 'recoil';
import { AuthState, Token } from '@constants';
import { destroyToken, saveToken } from '@store';
import { authSelector } from '@selectors';
import { useMe } from './useMe';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState<AuthState>(authSelector);

  const authenticateUser = async ({ token, csrf }: Token) => {
    const user = await useMe();
    saveToken({ token, csrf });
    setCurrentUser({ token, csrf, currentUser: user });
    console.log(currentUser);
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
