"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { Base, Cluster, Heading, Stack, Text, NotificationBar } from "smarthr-ui";
import { ArticleForm } from "@/components/articles/ArticleForm";
import { LogoutButton } from "@/components/LogoutButton";
import { GET_ARTICLE } from "@/lib/queries/article";
import Link from "next/link";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: { id },
  });

  if (loading) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <Text>読み込み中...</Text>
      </main>
    );
  }

  if (error || !data?.article) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <NotificationBar type="error">記事が見つかりません</NotificationBar>
      </main>
    );
  }

  const { article } = data;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <Cluster justify="space-between" align="center" style={{ marginBottom: "24px" }}>
        <Link href={`/articles/${id}`} style={{ fontSize: "14px", color: "#6b7280" }}>
          ← 記事詳細
        </Link>
        <LogoutButton />
      </Cluster>

      <Base padding="XL" layer={1}>
        <Stack gap="L">
          <Heading>記事編集</Heading>
          <ArticleForm
            articleId={article.id}
            lockVersion={article.lockVersion}
            defaultValues={{
              title: article.title,
              body: article.body,
              status: article.status as "draft" | "published" | "archived",
              tagNames: article.tags.map((t) => t.name)
            }}
          />
        </Stack>
      </Base>
    </main>
  );
}
