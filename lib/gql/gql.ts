/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n    }\n    me {\n      id\n    }\n  }\n": typeof types.GetArticleDocument,
    "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteArticleDocument,
    "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        user {\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.GetArticlesDocument,
};
const documents: Documents = {
    "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n    }\n    me {\n      id\n    }\n  }\n": types.GetArticleDocument,
    "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n": types.DeleteArticleDocument,
    "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        user {\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.GetArticlesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n    }\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n    }\n    me {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        user {\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        user {\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;