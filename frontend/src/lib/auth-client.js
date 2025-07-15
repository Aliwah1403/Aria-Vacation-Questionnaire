import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [adminClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  forgetPassword,
  resetPassword,
  useSession,
  updateUser,
  changePassword,
} = authClient;
