import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          articles: {
            keyArgs: false,
            merge(existing, incoming) {
              const existingNodes = existing?.nodes ?? [];
              const incomingNodes = incoming?.nodes ?? [];
              return {
                ...incoming,
                nodes: [...existingNodes, ...incomingNodes],
              };
            },
          },
        },
      },
    },
  }),
});
