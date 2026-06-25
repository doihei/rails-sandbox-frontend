import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { PopularTags } from "@/components/tags/PopularTags";
import { GET_TAGS } from "@/lib/queries/tag";

function renderWithProviders(ui: React.ReactElement, mocks: MockLink.MockedResponse[] = []) {
  const theme = createTheme();
  return render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider theme={theme}>
        <IntlProvider locale="ja">
          {ui}
        </IntlProvider>
      </ThemeProvider>
    </MockedProvider>
  );
}

const mockTags = {
  request: {
    query: GET_TAGS,
    variables: { first: 5 },
  },
  result: {
    data: {
      tags: {
        nodes: [
          { id: "t1", name: "rails", articlesCount: 10 },
          { id: "t2", name: "typescript", articlesCount: 5 },
          { id: "t3", name: "docker", articlesCount: 3 },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  },
};

describe("PopularTags", () => {
  it("ローディング中は「読み込み中...」を表示する", () => {
    renderWithProviders(<PopularTags />, [mockTags]);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("タグ名が表示される", async () => {
    renderWithProviders(<PopularTags />, [mockTags]);
    await waitFor(() => {
      expect(screen.getByText("rails")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
      expect(screen.getByText("docker")).toBeInTheDocument();
    });
  });

  it("タグが各タグページへのリンクになっている", async () => {
    renderWithProviders(<PopularTags />, [mockTags]);
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /rails/ });
      expect(link).toHaveAttribute("href", "/tags/t1");
    });
  });
});
