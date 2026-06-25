import { gql } from "@/lib/gql";

export const GET_TAGS = gql(`
  query GetTags($first: Int, $after: String) {
    tags(first: $first, after: $after) {
      nodes {
        id
        name
        articlesCount
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)

export const GET_TAGGED_ARTICLES = gql(`
  query GetTaggedArticles($tagId: ID!, $first: Int, $after: String) {
    taggedArticles(tagId: $tagId, first: $first, after: $after) {
      nodes {
        id
        title
        status
        createdAt
        commentsCount
        user {
          name
          email
        }
        tags {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)
