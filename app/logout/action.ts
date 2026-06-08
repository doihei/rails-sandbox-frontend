"use server";

import { clearToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<void> {
  await clearToken();
  redirect("/login");
}
