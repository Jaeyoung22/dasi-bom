"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthUser {
  id: string;
  dbId: string;
  nickname: string;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getCookie("kakao_user_id");
    const nickname = getCookie("kakao_nickname");
    const avatar = getCookie("kakao_avatar");

    const id = setTimeout(() => {
      if (userId && nickname) {
        setUser({
          id: userId,
          dbId: userId,
          nickname,
          avatarUrl: avatar || null,
        });
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const signOut = useCallback(() => {
    deleteCookie("kakao_user_id");
    deleteCookie("kakao_nickname");
    deleteCookie("kakao_avatar");
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
