"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import {
  Heading,
  Stack,
  Button,
  Text,
  Base,
  Cluster,
  NotificationBar,
  StatusLabel,
  AnchorButton,
  ControlledActionDialog,
} from "smarthr-ui";
import { GET_ARTICLE, DELETE_ARTICLE } from "@/lib/queries/article";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

const STATUS_LABEL: Record<string, { type: "green" | "grey"; text: string }> = {
  published: { type: "green", text: "公開済み" },
  draft: { type: "grey", text: "下書き" },
  archived: { type: "grey", text: "アーカイブ" },
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // useRef を追加してフォーカスを戻す
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const { data, loading, error } = useQuery(GET_ARTICLE, {
    variables: { id },
  });

  const [deleteArticle, { loading: deleting }] = useMutation(DELETE_ARTICLE);

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

  const { article, me } = data;
  const isOwner = me?.id === article.user.id;
  const statusLabel = STATUS_LABEL[article.status] ?? { type: "grey" as const, text: article.status };

  const handleDelete = (_: React.MouseEvent, { close }: { close: () => void }) => {
    deleteArticle({
      variables: { id: article.id, lockVersion: article.lockVersion },
      onCompleted: (result) => {
        if (result.deleteArticle?.success) {
          router.push("/articles");
        } else {
          close();
        }
      },
    });
  };

  const handleClose = () => {
    setDeleteDialogOpen(false)
    setTimeout(() => deleteButtonRef.current?.focus(), 0) // フォーカスを削除ボタンに戻す
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      {/* ナビゲーション */}
      <Cluster justify="space-between" align="center" style={{ marginBottom: "24px" }}>
        <Link href="/articles" style={{ fontSize: "14px", color: "#6b7280" }}>
          ← 記事一覧
        </Link>
        <LogoutButton />
      </Cluster>

      <Base padding="XL" layer={1}>
        <Stack gap="L">
          {/* タイトル・ステータス */}
          <Stack gap="XS">
            <Cluster align="center" gap="M">
              <Heading>{article.title}</Heading>
              <StatusLabel type={statusLabel.type}>{statusLabel.text}</StatusLabel>
            </Cluster>
            <Text size="S" color="TEXT_GREY">
              {article.user.name || article.user.email} ·{" "}
              {new Date(article.createdAt).toLocaleDateString("ja-JP")}
            </Text>
          </Stack>

          {/* タグ */}
          {article.tags.length > 0 && (
            <Cluster gap="XS">
              {article.tags.map((tag: { id: string; name: string }) => (
                <StatusLabel key={tag.id} type="blue">{tag.name}</StatusLabel>
              ))}
            </Cluster>
          )}

          {/* 本文 */}
          <div
            style={{
              lineHeight: 1.8,
              color: "#374151",
              whiteSpace: "pre-wrap",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
            }}
          >
            {article.body}
          </div>

          {/* オーナーのみ操作ボタン */}
          {isOwner && (
            <Cluster gap="M" style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
              <AnchorButton elementAs={Link} href={`/articles/${article.id}/edit`} variant="secondary">
                編集
              </AnchorButton>
              <Button
                ref={deleteButtonRef}
                variant="danger"
                onClick={() => setDeleteDialogOpen(true)}
                loading={deleting}
              >
                削除
              </Button>
            </Cluster>
          )}
        </Stack>
      </Base>

      <ControlledActionDialog
        isOpen={deleteDialogOpen}
        onClickClose={handleClose}
        heading="記事の削除"
        actionButton={{ text: "削除する", theme: "danger", disabled: deleting }}
        closeButton={{ text: "キャンセル", disabled: deleting }}
        onClickAction={handleDelete}
      >
        この記事を削除しますか？
      </ControlledActionDialog>
    </main>
  );
}
