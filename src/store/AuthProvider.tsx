import React, { createContext, useContext, useEffect, useState } from "react";

import {
  getUserFromAnyStorage,
  saveUserToStorage,
  removeUserFromStorage,
  StorageType,
} from "../features/auth/utils";
import type { User } from "../features/auth/types/auth.types";
interface AuthContextProps {
  user: User | null;
  login: (userData: User, rememberUser?: boolean) => void;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // global states

  // local states
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUserFromAnyStorage();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  const updateUser = (userData: Partial<User>) => {
    const newUser: User = {
      ...user!,
      ...userData,
    };

    setUser((old) =>
      old
        ? {
            ...newUser,
          }
        : null,
    );

    const storage = localStorage.getItem("user")
      ? localStorage
      : sessionStorage;
    storage.setItem("user", JSON.stringify(newUser));
  };

  const login = (userData: User, rememberUser: boolean = false) => {
    const storageType = rememberUser ? StorageType.LOCAL : StorageType.SESSION;
    saveUserToStorage(userData, storageType);
    setUser(userData);
  };

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ loading, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("use auth must be work in auth provider");
  }
  return context;
};
export default AuthProvider;
