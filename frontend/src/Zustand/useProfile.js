import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useProfile = create((set) => {
  const getUser = () => {
    if (localStorage.getItem("token_user")) {
      return jwtDecode(localStorage.getItem("token_user")).userid;
    }
    return null;
  };

  return {
    userId: getUser(),
    login: (token) => {
      if (!token) return;
      localStorage.setItem("token_user", token);
      set({ userId: getUser() });
    },
    logout: () => {
      localStorage.removeItem("token_user");
      set({ userId: getUser() });
    },
    isLoggedIn: () => !!getUser(),
  };
});

export default useProfile;
