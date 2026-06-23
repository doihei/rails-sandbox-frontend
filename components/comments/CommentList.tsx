'use client'

import { useMutation } from "@apollo/client/react"
import { Button, Cluster, Stack, Text } from "smarthr-ui"
import { DELETE_COMMENT } from "@/lib/queries/comment"
import { GET_ARTICLE } from "@/lib/queries/article"
import type { GetArticleQuery } from "@/lib/gql/graphql"

type Comment = NonNullable<
  NonNullable<GetArticleQuery['article']>['comments']>[number]

type Props = {
  comments: Comment[]
  articleId: string
  meId: string | undefined
}

export function CommentList({ comments, articleId, meId }: Props) {
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_ARTICLE, variables: { id: articleId }}],
  })

  if (comments.length === 0) {
    return (
      <Text color="TEXT_GREY">まだコメントはありません</Text>
    )
  }

  return (
    <Stack gap={1}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            padding: '12px 16px',
            border: '1px solid #d6d3d0',
            borderRadius: 8,
          }}
        >
          <Stack gap={0.5}>
            <Text size="S" color="TEXT_GREY">
              {comment.user.name ?? comment.user.email} ·{' '}
              {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
            </Text>
            <Text>{comment.body}</Text>
            {meId && comment.user.id === meId && (
              <Cluster justify="flex-end">
                <Button
                  size="S"
                  variant="danger"
                  onClick={async () => {
                    await deleteComment({ variables: { id: comment.id } })
                  }}
                >
                  削除
                </Button>
              </Cluster>
            )}
          </Stack>
        </div>
      ))}
    </Stack>
  )
}
