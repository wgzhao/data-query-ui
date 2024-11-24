// Utilities
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: false,
      userRole: null,
      token: null,
      name: null
    };
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage
      }
    ]
  },
  getters: {
    isUserAuthenticated: state => state.isAuthenticated,
    isAdmin: state => state.userRole === "ROLE_ADMIN",
    isUser: state => state.userRole === "ROLE_USER"
  },
  actions: {
    login(user) {
      this.isAuthenticated = true;
      this.userRole = user.role;
      this.token = user.token;
    },
    logout() {
      this.isAuthenticated = false;
      this.userRole = null;
      this.token = null;
      this.name = null;
    },
    setToken(newToken: string) {
      this.token = newToken;
    }
  }
});
