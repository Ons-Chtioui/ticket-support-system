import api from './api';

const register = (username, email, password) => {
  return api.post('/auth/signup/', { 
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });

  if (response.data.access) {
    // Stockage des tokens et de l'utilisateur complet
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
