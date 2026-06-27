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
    "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      likesCount\n      likedByMe\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n      comments {\n        id\n        body\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n      }\n      commentsCount\n    }\n    me {\n      id\n    }\n  }\n": typeof types.GetArticleDocument,
    "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteArticleDocument,
    "\n  mutation UpdateArticle(\n    $id: ID!\n    $title: String\n    $body: String\n    $status: String\n    $lockVersion: Int\n    $tagNames: [String!]\n  ) {\n    updateArticle(input: {\n      id: $id\n      title: $title\n      body: $body\n      status: $status\n      lockVersion: $lockVersion\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n        title\n        body\n        status\n        lockVersion\n        tags { id name }\n      }\n      errors\n    }\n  }\n": typeof types.UpdateArticleDocument,
    "\n  mutation CreateArticle(\n    $title: String!,\n    $body: String!,\n    $tagNames: [String!]\n  ) {\n    createArticle(input: {\n      title: $title,\n      body: $body,\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n      }\n      errors\n    }\n  }\n": typeof types.CreateArticleDocument,
    "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n        commentsCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n": typeof types.GetArticlesDocument,
    "\n  mutation CreateComment($articleId: ID!, $body: String!) {\n    createComment(input: { articleId: $articleId, body: $body }) {\n      comment {\n        id\n        body\n        createdAt\n        user { name email }\n      }\n      errors\n    }\n  }\n": typeof types.CreateCommentDocument,
    "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n": typeof types.DeleteCommentDocument,
    "\n  mutation ToggleLike($likeableId: ID!, $likeableType: String!) {\n    toggleLike(input: { likeableId: $likeableId, likeableType: $likeableType }) {\n      __typename\n      liked\n      likesCount\n      errors\n    }\n  }\n": typeof types.ToggleLikeDocument,
    "\n  query GetTags($first: Int, $after: String) {\n    tags(first: $first, after: $after) {\n      nodes {\n        id\n        name\n        articlesCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.GetTagsDocument,
    "\n  query GetTaggedArticles($tagId: ID!, $first: Int, $after: String) {\n    taggedArticles(tagId: $tagId, first: $first, after: $after) {\n      nodes {\n        id\n        title\n        status\n        createdAt\n        commentsCount\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n": typeof types.GetTaggedArticlesDocument,
};
const documents: Documents = {
    "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      likesCount\n      likedByMe\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n      comments {\n        id\n        body\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n      }\n      commentsCount\n    }\n    me {\n      id\n    }\n  }\n": types.GetArticleDocument,
    "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n": types.DeleteArticleDocument,
    "\n  mutation UpdateArticle(\n    $id: ID!\n    $title: String\n    $body: String\n    $status: String\n    $lockVersion: Int\n    $tagNames: [String!]\n  ) {\n    updateArticle(input: {\n      id: $id\n      title: $title\n      body: $body\n      status: $status\n      lockVersion: $lockVersion\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n        title\n        body\n        status\n        lockVersion\n        tags { id name }\n      }\n      errors\n    }\n  }\n": types.UpdateArticleDocument,
    "\n  mutation CreateArticle(\n    $title: String!,\n    $body: String!,\n    $tagNames: [String!]\n  ) {\n    createArticle(input: {\n      title: $title,\n      body: $body,\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n      }\n      errors\n    }\n  }\n": types.CreateArticleDocument,
    "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n        commentsCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n": types.GetArticlesDocument,
    "\n  mutation CreateComment($articleId: ID!, $body: String!) {\n    createComment(input: { articleId: $articleId, body: $body }) {\n      comment {\n        id\n        body\n        createdAt\n        user { name email }\n      }\n      errors\n    }\n  }\n": types.CreateCommentDocument,
    "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n": types.DeleteCommentDocument,
    "\n  mutation ToggleLike($likeableId: ID!, $likeableType: String!) {\n    toggleLike(input: { likeableId: $likeableId, likeableType: $likeableType }) {\n      __typename\n      liked\n      likesCount\n      errors\n    }\n  }\n": types.ToggleLikeDocument,
    "\n  query GetTags($first: Int, $after: String) {\n    tags(first: $first, after: $after) {\n      nodes {\n        id\n        name\n        articlesCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.GetTagsDocument,
    "\n  query GetTaggedArticles($tagId: ID!, $first: Int, $after: String) {\n    taggedArticles(tagId: $tagId, first: $first, after: $after) {\n      nodes {\n        id\n        title\n        status\n        createdAt\n        commentsCount\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n": types.GetTaggedArticlesDocument,
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
export function gql(source: "\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      likesCount\n      likedByMe\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n      comments {\n        id\n        body\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n      }\n      commentsCount\n    }\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetArticle($id: ID!) {\n    article(id: $id) {\n      id\n      title\n      body\n      status\n      lockVersion\n      createdAt\n      updatedAt\n      likesCount\n      likedByMe\n      user {\n        id\n        name\n        email\n      }\n      tags {\n        id\n        name\n      }\n      comments {\n        id\n        body\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n      }\n      commentsCount\n    }\n    me {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteArticle($id: ID!, $lockVersion: Int!) {\n    deleteArticle(input: { id: $id, lockVersion: $lockVersion }) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateArticle(\n    $id: ID!\n    $title: String\n    $body: String\n    $status: String\n    $lockVersion: Int\n    $tagNames: [String!]\n  ) {\n    updateArticle(input: {\n      id: $id\n      title: $title\n      body: $body\n      status: $status\n      lockVersion: $lockVersion\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n        title\n        body\n        status\n        lockVersion\n        tags { id name }\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArticle(\n    $id: ID!\n    $title: String\n    $body: String\n    $status: String\n    $lockVersion: Int\n    $tagNames: [String!]\n  ) {\n    updateArticle(input: {\n      id: $id\n      title: $title\n      body: $body\n      status: $status\n      lockVersion: $lockVersion\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n        title\n        body\n        status\n        lockVersion\n        tags { id name }\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateArticle(\n    $title: String!,\n    $body: String!,\n    $tagNames: [String!]\n  ) {\n    createArticle(input: {\n      title: $title,\n      body: $body,\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArticle(\n    $title: String!,\n    $body: String!,\n    $tagNames: [String!]\n  ) {\n    createArticle(input: {\n      title: $title,\n      body: $body,\n      tagNames: $tagNames\n    }) {\n      article {\n        id\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n        commentsCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetArticles($first: Int, $after: String) {\n    articles(first: $first, after: $after) {\n      nodes {\n        id\n        title\n        body\n        status\n        createdAt\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n        commentsCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateComment($articleId: ID!, $body: String!) {\n    createComment(input: { articleId: $articleId, body: $body }) {\n      comment {\n        id\n        body\n        createdAt\n        user { name email }\n      }\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($articleId: ID!, $body: String!) {\n    createComment(input: { articleId: $articleId, body: $body }) {\n      comment {\n        id\n        body\n        createdAt\n        user { name email }\n      }\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteComment($id: ID!) {\n    deleteComment(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteComment($id: ID!) {\n    deleteComment(input: { id: $id }) {\n      success\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ToggleLike($likeableId: ID!, $likeableType: String!) {\n    toggleLike(input: { likeableId: $likeableId, likeableType: $likeableType }) {\n      __typename\n      liked\n      likesCount\n      errors\n    }\n  }\n"): (typeof documents)["\n  mutation ToggleLike($likeableId: ID!, $likeableType: String!) {\n    toggleLike(input: { likeableId: $likeableId, likeableType: $likeableType }) {\n      __typename\n      liked\n      likesCount\n      errors\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTags($first: Int, $after: String) {\n    tags(first: $first, after: $after) {\n      nodes {\n        id\n        name\n        articlesCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetTags($first: Int, $after: String) {\n    tags(first: $first, after: $after) {\n      nodes {\n        id\n        name\n        articlesCount\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTaggedArticles($tagId: ID!, $first: Int, $after: String) {\n    taggedArticles(tagId: $tagId, first: $first, after: $after) {\n      nodes {\n        id\n        title\n        status\n        createdAt\n        commentsCount\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query GetTaggedArticles($tagId: ID!, $first: Int, $after: String) {\n    taggedArticles(tagId: $tagId, first: $first, after: $after) {\n      nodes {\n        id\n        title\n        status\n        createdAt\n        commentsCount\n        likesCount\n        likedByMe\n        user {\n          id\n          name\n          email\n        }\n        tags {\n          id\n          name\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n    me {\n      id\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;