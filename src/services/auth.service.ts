import axios from 'axios';
import User from '@/types/user'

const API_URL = "http://localhost:9090/api/v1/auth";

class AuthService {
  login(user: User) {
    return axios
      .post(API_URL + '/login', {
        username: user.username,
        password: user.password
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user: User) {
    return axios.post(API_URL + '/register', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
