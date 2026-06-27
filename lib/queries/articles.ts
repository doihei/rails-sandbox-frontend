import { gql } from "@/lib/gql";

export const ARTICLES_QUERY = gql(`
  query GetArticles($first: Int, $after: String) {
    articles(first: $first, after: $after) {
      nodes {
        id
        title
        body
        status
        createdAt
        likesCount
        likedByMe
        user {
          id
          name
          email
        }
        tags {
          id
          name
        }
        commentsCount
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    me {
      id
    }
  }
`);
