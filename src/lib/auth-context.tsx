"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "./supabase";

interface AuthUser {
  id: string; // Supabase auth UID
  dbId: string | null; // users 테이블 ID
  nickname: string;
  avatarUrl: string | null;
  email: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    // 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        setLoading(false);
      }
    });

    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function syncUser(authUser: any) {
    const supabase = getSupabase();

    // users 테이블에서 찾기
    const { data: existing } = await supabase
      .from("users")
      .select("id, nickname, avatar_url")
      .eq("auth_id", authUser.id)
      .single();

    if (existing) {
      setUser({
        id: authUser.id,
        dbId: existing.id,
        nickname: existing.nickname,
        avatarUrl: existing.avatar_url,
        email: authUser.email,
      });
    } else {
      // 새 유저 생성
      const nickname =
        authUser.user_metadata?.name ||
        authUser.user_metadata?.full_name ||
        authUser.email?.split("@")[0] ||
        "익명";

      const { data: newUser } = await supabase
        .from("users")
        .insert({
          auth_id: authUser.id,
          nickname,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          provider: authUser.app_metadata?.provider || "unknown",
        })
        .select("id")
        .single();

      setUser({
        id: authUser.id,
        dbId: newUser?.id || null,
        nickname,
        avatarUrl: authUser.user_metadata?.avatar_url || null,
        email: authUser.email,
      });
    }
    setLoading(false);
  }

  async function handleSignOut() {
    await getSupabase().auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signOut: handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
