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
      comments {
        id
        body
        createdAt
        likesCount
        likedByMe
        user {
          id
          name
          email
        }
      }
      commentsCount
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

export const UPDATE_ARTICLE = gql(`
  mutation UpdateArticle(
    $id: ID!
    $title: String
    $body: String
    $status: String
    $lockVersion: Int
    $tagNames: [String!]
  ) {
    updateArticle(input: {
      id: $id
      title: $title
      body: $body
      status: $status
      lockVersion: $lockVersion
      tagNames: $tagNames
    }) {
      article {
        id
        title
        body
        status
        lockVersion
        tags { id name }
      }
      errors
    }
  }
`);

export const CREATE_ARTICLE = gql(`
  mutation CreateArticle(
    $title: String!,
    $body: String!,
    $tagNames: [String!]
  ) {
    createArticle(input: {
      title: $title,
      body: $body,
      tagNames: $tagNames
    }) {
      article {
        id
      }
      errors
    }
  }
`);
