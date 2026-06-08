"use client";

import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider, createTheme } from "smarthr-ui";
import { locale as jaMessages } from "smarthr-ui/lib/intl/locales/ja";
import { IntlProvider } from "react-intl";
import { createApolloClient } from "@/lib/apollo-client";
import { useMemo } from "react";

const theme = createTheme();

type Props = {
  children: React.ReactNode;
  token?: string;
};

export function Providers({ children, token }: Props) {
  const client = useMemo(() => createApolloClient(token), [token]);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja" messages={jaMessages}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </IntlProvider>
    </ThemeProvider>
  );
}
