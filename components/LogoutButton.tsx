"use client";

import { Button } from "smarthr-ui";
import { logoutAction } from "@/app/logout/action";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary" size="S">
        ログアウト
      </Button>
    </form>
  );
}
