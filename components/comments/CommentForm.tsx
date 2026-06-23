'use client'

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { Button, Cluster, FormControl, Textarea, Stack, NotificationBar } from "smarthr-ui"
import { CREATE_COMMENT } from "@/lib/queries/comment"
import { GET_ARTICLE } from "@/lib/queries/article"

type Props = {
  articleId: string
}

export function CommentForm({ articleId }: Props) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [createComment, { loading }] = useMutation(CREATE_COMMENT, {
    refetchQueries: (result) =>
      result.data?.createComment?.errors?.length
        ? []
        : [{ query: GET_ARTICLE, variables: { id: articleId } }],
    onCompleted(data) {
      if (data.createComment?.errors?.length) {
        setError(data.createComment.errors[0])
        return
      }
      setBody('')
      setError(null)
    },
  })

  return (
    <Stack gap="M" as="form"
      onSubmit={async (e) => {
        e.preventDefault()
        await createComment({ variables: { articleId, body } })
      }}
      style={{ borderTop: "1px solid #d6d3d0", paddingTop: "24px" }}
    >
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {error && <NotificationBar type="error">{error}</NotificationBar>}
      </div>

      <FormControl
        label={{ text: "コメントを追加", htmlFor: "comment-body" }}
      >
        <Textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-invalid={!!error}
          width="100%"
          rows={3}
        />
      </FormControl>
      <Cluster justify="flex-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!body.trim()}
        >
          コメントする
        </Button>
      </Cluster>
    </Stack>
  )
}
