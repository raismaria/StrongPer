import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AxiosResponse } from "axios";
import api from "../utils/api";

// ================= TYPES =================
interface User {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  isAdmin: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role?: "Admin" | "User";
    isAdmin?: boolean;
  };
}

interface UserContextType {
  user: User | null;
  login: (userData: LoginCredentials) => Promise<User>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

// ================= CONTEXT =================
const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {
    throw new Error("login not implemented");
  },
  register: async () => {
    throw new Error("register not implemented");
  },
  logout: () => {},
  loading: true,
  isAdmin: false,
});

// ================= PROVIDER =================
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser) as User);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOGIN =================
  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post(
        "/auth/login",
        credentials
      );

      const { token, data } = response.data;

      const user: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role ?? "User",
        isAdmin: data.role === "Admin",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // ================= REGISTER =================
  const register = async (
    credentials: RegisterCredentials
  ): Promise<void> => {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post(
        "/auth/register",
        credentials
      );

      const { token, data } = response.data;

      const user: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role ?? "User",
        isAdmin: data.role === "Admin",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAdmin: user?.role === "Admin",
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
