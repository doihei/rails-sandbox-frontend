import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8080/graphql",
  documents: ["**/*.tsx", "**/*.ts", "!node_modules/**"],
  generates: {
    "./lib/gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        scalars: {
          ISO8601DateTime: "string",
          ISO8601Date: "string",
        },
      },
    },
  },
};

export default config;