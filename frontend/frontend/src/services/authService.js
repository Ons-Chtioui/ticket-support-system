import api from './api';

const register = (username, email, password) => {
  // Django attend souvent un slash '/' à la fin de l'URL
  return api.post('/auth/signup/', { 
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    
    if (response.data.access) {
        // ⚠️ TRÈS IMPORTANT : Utilisez les mêmes clés que le backend
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh); // Optionnel si vous gérez le refresh
    }
    
    return response.data;
};
const logout = () => {
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