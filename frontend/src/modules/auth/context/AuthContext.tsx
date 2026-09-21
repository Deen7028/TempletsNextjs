'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../interfaces/IAuth';

import { authService } from '../services/authService';

interface IAuthContext {
  objUser: IUser | null;
  isLoading: boolean;
  loginUser: (user: IUser) => void;
  updateUser: (updatedFields: Partial<IUser>) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<IAuthContext>({
  objUser: null,
  isLoading: true,
  loginUser: () => {},
  updateUser: () => {},
  logoutUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [objUser, setObjUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. อ่านข้อมูลเบื้องต้นจาก localStorage สำหรับ UI ทันที
    try {
      const sSavedUser = localStorage.getItem('user');
      if (sSavedUser) {
        setObjUser(JSON.parse(sSavedUser));
      }
    } catch {
      // ignore
    }

    // 2. ยกระดับความปลอดภัย: ตรวจสอบ Session จริงกับ Backend ผ่าน Cookie HttpOnly
    authService.getCurrentUser().then((user) => {
      if (user) {
        setObjUser(user);
        try {
          localStorage.setItem('user', JSON.stringify(user));
        } catch {
          // ignore
        }
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const loginUser = (user: IUser) => {
    setObjUser(user);
    try {
      localStorage.setItem('user', JSON.stringify(user));
      // ปลอดภัย: ไม่เก็บ JWT token ลงใน localStorage ปล่อยให้เบราว์เซอร์จัดการผ่าน HttpOnly Cookie
      localStorage.removeItem('authToken');
    } catch {
      // ignore
    }
  };


  const updateUser = (updatedFields: Partial<IUser>) => {
    setObjUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const logoutUser = () => {
    setObjUser(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ objUser, isLoading, loginUser, updateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
