"use client";

import { ArticleList } from "@/components/articles/ArticleList";
import { PageLayout } from "@/components/PageLayout";
import { AnchorButton, Cluster, Heading } from "smarthr-ui";
import Link from "next/link";

export default function ArticlesPage() {
  return (
    <PageLayout>
      <Cluster justify="space-between" align="center" style={{ marginBottom: "24px" }}>
        <Heading>記事一覧</Heading>
        <AnchorButton elementAs={Link} href="/articles/new" variant="primary">
          新規作成
        </AnchorButton>
      </Cluster>
      <ArticleList />
    </PageLayout>
  );
}
