import { cookies } from "next/headers";

export const TOKEN_COOKIE = "jwt_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Cookieからトークンを取得（Server Component / middlewareから呼ぶ）
export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

// Cookieにトークンを保存（Server Actionから呼ぶ）
export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// Cookieからトークンを削除（ログアウト時）
export async function clearToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
}
