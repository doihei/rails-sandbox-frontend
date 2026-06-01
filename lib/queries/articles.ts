import { gql } from "@apollo/client";

export type Tag = {
  id: string;
  name: string;
};

export type User = {
  name: string | null;
  email: string;
};

export type Article = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  user: User;
  tags: Tag[];
};

export type ArticlesQueryResult = {
  articles: {
    nodes: Article[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

export const ARTICLES_QUERY = gql`
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
`;
