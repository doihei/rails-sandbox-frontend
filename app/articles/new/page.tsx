"use client";

import { Base, Heading, Stack } from "smarthr-ui";
import { ArticleForm } from "@/components/ArticleForm";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

export default function NewArticlePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Link href="/articles" style={{ fontSize: "14px", color: "#6b7280" }}>
          ← 記事一覧
        </Link>
        <LogoutButton />
      </div>

      <Base padding="XL" layer={1}>
        <Stack gap="L">
          <Heading>新規記事作成</Heading>
          <ArticleForm />
        </Stack>
      </Base>
    </main>
  );
}
