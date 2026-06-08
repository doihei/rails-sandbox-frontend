"use server";

import { setToken } from "@/lib/auth";
import { redirect } from "next/navigation";

type LoginResult =
  | { success: true }
  | { success: false; error: string }

export async function loginAction(
  _prevState: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "メールアドレスとパスワードを入力してください" };
  }

  const endpoint =
    process.env.GRAPHQL_ENDPOINT_SERVER ??
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
    "http://host.docker.internal:8080/graphql";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation($email: String!, $password: String!) {
            createSession(input: { email: $email, password: $password }) {
              token
              errors
            }
          }
        `,
        variables: { email, password },
      }),
    });

    const json = await res.json();
    const data = json?.data?.createSession;

    if (!data) {
      return { success: false, error: "サーバーエラーが発生しました" };
    }

    if (data.errors && data.errors.length > 0) {
      return { success: false, error: data.errors[0] };
    }

    if (!data.token) {
      return { success: false, error: "トークンの取得に失敗しました" };
    }

    await setToken(data.token);
  } catch {
    return { success: false, error: "ネットワークエラーが発生しました" };
  }

  redirect("/articles");
}
