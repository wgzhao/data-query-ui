import User from "@/types/user";
import Request from "@/utils/request";

class AuthService {
  login(user: User) {
    return Request.post("/auth/login", {
      username: user.username,
      password: user.password
    });
    // return axios
    //   .post(API_URL + '/login', {
    //     username: user.username,
    //     password: user.password
    //   });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user: User) {
    return Request.post("/auth/register", {
      username: user.username,
      password: user.password
    });
  }
}

export default new AuthService();
