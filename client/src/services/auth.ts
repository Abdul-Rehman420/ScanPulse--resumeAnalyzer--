import { supabase } from "@/lib/supabase";
import api from "./api";
import { AuthResponse, User } from "@/types";

async function fetchProfile(token: string): Promise<User> {
  return api.get<User>("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
}

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;

    if (!data.session) {
      throw new Error("Please check your email to confirm your account.");
    }

    const user = await fetchProfile(data.session.access_token);
    return { user, token: data.session.access_token } as AuthResponse;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.session) {
      throw new Error("Unable to sign in");
    }

    const user = await fetchProfile(data.session.access_token);
    return { user, token: data.session.access_token } as AuthResponse;
  },

  async getProfile() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw new Error("No active session");
    }
    return fetchProfile(data.session.access_token);
  },

  async logout() {
    await supabase.auth.signOut();
  },
};
