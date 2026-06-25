"use client";

import { Cluster, Table, Th, Td, Button, StatusLabel } from "smarthr-ui";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  status: string;
  commentsCount: number;
  user: { name?: string | null; email: string };
  tags: { id: string; name: string }[];
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

type Props = {
  articles: Article[];
  pageInfo?: PageInfo;
  onFetchMore?: () => void;
};

export function ArticleTable({ articles, pageInfo, onFetchMore }: Props) {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <Th style={{ minWidth: 280 }}>タイトル</Th>
            <Th style={{ width: 120 }}>ステータス</Th>
            <Th style={{ width: 120 }}>著者</Th>
            <Th>タグ</Th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <Td>
                <Link href={`/articles/${article.id}`} style={{ color: "inherit" }}>
                  {article.title} ({article.commentsCount}件)
                </Link>
              </Td>
              <Td>
                <StatusLabel type={article.status === "published" ? "green" : "grey"}>
                  {article.status}
                </StatusLabel>
              </Td>
              <Td>{article.user.name ?? article.user.email}</Td>
              <Td>
                <Cluster gap="XXS">
                  {article.tags.map((tag) => (
                    <StatusLabel key={tag.id} type="blue">
                      {tag.name}
                    </StatusLabel>
                  ))}
                </Cluster>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {pageInfo?.hasNextPage && onFetchMore && (
        <Cluster justify="center" style={{ marginTop: "1rem" }}>
          <Button variant="secondary" onClick={onFetchMore}>
            もっと見る
          </Button>
        </Cluster>
      )}
    </div>
  );
}
