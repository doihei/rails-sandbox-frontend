import { gql } from "@/lib/gql";

export const GET_ARTICLE = gql(`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      body
      status
      lockVersion
      createdAt
      updatedAt
      user {
        id
        name
        email
      }
      tags {
        id
        name
      }
    }
    me {
      id
    }
  }
`);

export const DELETE_ARTICLE = gql(`
  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {
    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {
      success
      errors
    }
  }
`);
