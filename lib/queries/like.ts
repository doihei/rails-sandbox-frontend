import { gql } from "@/lib/gql";

export const TOGGLE_LIKE = gql(`
  mutation ToggleLike($likeableId: ID!, $likeableType: String!) {
    toggleLike(input: { likeableId: $likeableId, likeableType: $likeableType }) {
      __typename
      liked
      likesCount
      errors
    }
  }
`)
