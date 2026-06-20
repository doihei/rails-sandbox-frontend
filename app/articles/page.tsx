"use client";

import { ArticleList } from "@/components/ArticleList";
import { AnchorButton, Heading } from "smarthr-ui";
import Link from "next/link";

export default function ArticlesPage() {
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
        <Heading>記事一覧</Heading>
        <AnchorButton elementAs={Link} href="/articles/new" variant="primary">
            新規作成
        </AnchorButton>
      </div>
      <ArticleList />
    </main>
  );
}
