"use client";

import { useActionState } from "react";
import { Base, Button, FormControl, Heading, Input, NotificationBar, Stack } from "smarthr-ui";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}
    >
      <Base padding="XL" layer={1} style={{ width: "100%", maxWidth: "360px" }}>
        <Stack gap="L">
          <Heading>ログイン</Heading>

          {state && !state.success && (
            <NotificationBar type="error" role="alert">
              {state.error}
            </NotificationBar>
          )}

          <form action={action}>
            <Stack gap="M">
              <FormControl label={{ text: "メールアドレス", htmlFor: "email" }}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  width="100%"
                />
              </FormControl>

              <FormControl label={{ text: "パスワード", htmlFor: "password" }}>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  width="100%"
                />
              </FormControl>

              <Button type="submit" variant="primary" wide loading={isPending}>
                {isPending ? "ログイン中..." : "ログイン"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Base>
    </div>
  );
}
