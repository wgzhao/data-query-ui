import axios from 'axios';
import User from '@/types/user'

const API_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  login(user: User) {
    return axios
      .post(API_URL + '/auth/login', {
        username: user.username,
        password: user.password
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user: User) {
    return axios.post(API_URL + 'auth/register', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
