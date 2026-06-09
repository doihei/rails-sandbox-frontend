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
`);
