import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

// トークン付き Apollo Client を生成する（クライアントサイド用）
export function createApolloClient(token?: string) {
  const authLink = new ApolloLink((operation, forward) => {
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return forward(operation);
  });

  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
      "http://localhost:8080/graphql",
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            articles: {
              keyArgs: false,
              merge(existing, incoming, { args }) {
                const existingNodes = args?.after ? (existing?.nodes ?? []) : [];
                const incomingNodes = incoming?.nodes ?? [];
                return { ...incoming, nodes: [...existingNodes, ...incomingNodes] };
              },
            },
            tags: {
              keyArgs: false,
              merge(existing, incoming, { args }) {
                const existingNodes = args?.after ? (existing?.nodes ?? []) : [];
                const incomingNodes = incoming?.nodes ?? [];
                return { ...incoming, nodes: [...existingNodes, ...incomingNodes] };
              },
            },
            taggedArticles: {
              keyArgs: ['tagId'],
              merge(existing, incoming, { args }) {
                const existingNodes = args?.after ? (existing?.nodes ?? []) : [];
                const incomingNodes = incoming?.nodes ?? [];
                return { ...incoming, nodes: [...existingNodes, ...incomingNodes] };
              },
            },
          },
        },
      },
    }),
  });
}

// トークン無し（公開ページ用のシングルトン）
export const apolloClient = createApolloClient();
