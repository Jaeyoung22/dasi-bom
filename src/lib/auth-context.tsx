"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getSupabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  dbId: string | null;
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

  const syncUser = useCallback(async (authUser: SupabaseUser) => {
    const supabase = getSupabase();

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
        email: authUser.email ?? null,
      });
    } else {
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
        email: authUser.email ?? null,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        setLoading(false);
      }
    });

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
  }, [syncUser]);

  const handleSignOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
