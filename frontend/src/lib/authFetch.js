import { auth } from './firebase';

export const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const authFetch = async (url, options = {}) => {
  const headers = {
    ...(options.headers || {}),
    ...(await getAuthHeaders()),
  };
  return fetch(url, { ...options, headers });
};
