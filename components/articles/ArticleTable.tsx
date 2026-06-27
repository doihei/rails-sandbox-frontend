"use client";

import { Cluster, Table, Th, Td, Button, StatusLabel } from "smarthr-ui";
import Link from "next/link";
import { LikeButton } from "@/components/likes/LikeButton";

type Article = {
  id: string;
  title: string;
  status: string;
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  user: { id: string; name?: string | null; email: string };
  tags: { id: string; name: string }[];
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

type Props = {
  articles: Article[];
  pageInfo?: PageInfo;
  meId?: string;
  onFetchMore?: () => void;
};

export function ArticleTable({ articles, pageInfo, meId, onFetchMore }: Props) {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <Th style={{ minWidth: 280 }}>タイトル</Th>
            <Th style={{ width: 120 }}>ステータス</Th>
            <Th style={{ width: 120 }}>著者</Th>
            <Th>タグ</Th>
            <Th style={{ width: 80 }}>いいね</Th>
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
              <Td>
                <LikeButton
                  likeableId={article.id}
                  likeableType="Article"
                  likesCount={article.likesCount}
                  likedByMe={article.likedByMe}
                  cacheId={article.id}
                  disabled={meId !== undefined && meId === article.user.id}
                />
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
