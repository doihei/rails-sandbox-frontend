'use client'

import { useMutation } from "@apollo/client/react"
import { Button } from "smarthr-ui"
import { TOGGLE_LIKE } from "@/lib/queries/like"

type Props = {
  likeableId:   string
  likeableType: 'Article' | 'Comment'
  likesCount:   number
  likedByMe:    boolean
  // キャッシュ更新のために Apollo が使う id（article.id または comment.id）
  cacheId:      string
  disabled?:    boolean
}

export function LikeButton({
  likeableId,
  likeableType,
  likesCount,
  likedByMe,
  cacheId,
  disabled,
}: Props) {
  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE, {
    optimisticResponse: {
      toggleLike: {
        __typename: 'ToggleLikePayload',
        liked: !likedByMe,
        likesCount: likedByMe ? likesCount - 1: likesCount + 1,
        errors: [],
      }
    },
    update(cache, { data }) {
      if (!data?.toggleLike) return

      const { liked, likesCount: newCount } = data.toggleLike

      // キャッシュのフィールドを直接書き換える
      cache.modify({
        id: cache.identify({ __typename: likeableType, id: cacheId }),
        fields: {
          likesCount: () => newCount,
          likedByMe:  () => liked,
        },
      })
    }
  })

  return (
    <Button
      size="S"
      variant={likedByMe ? 'primary' : 'secondary'}
      onClick={() =>
        toggleLike({
          variables: { likeableId, likeableType },
        })
      }
      disabled={loading || (disabled ?? false)}
      aria-label={`いいね ${likesCount}`}
      aria-pressed={likedByMe}  // ✅ a11y: トグルボタンの状態を Screen Reader に伝える
    >
      {likedByMe ? '❤️' : '🤍'} {likesCount}
    </Button>
  )
}
