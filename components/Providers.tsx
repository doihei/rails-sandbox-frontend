"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";
import { ThemeProvider, createTheme } from "smarthr-ui";
import { IntlProvider } from "react-intl";
import { apolloClient } from "@/lib/apollo-client";

const theme = createTheme();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale="ja">
      <BaseApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BaseApolloProvider>
    </IntlProvider>
  );
}