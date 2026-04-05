import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);

  const login = (newToken, newUsername) => {
    dispatch(setCredentials({ token: newToken, username: newUsername }));
  };

  const logout = () => {
    dispatch(clearCredentials());
  };

  return { token, username, login, logout };
};
