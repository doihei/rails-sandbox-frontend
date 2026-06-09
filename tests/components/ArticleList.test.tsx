import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { ArticleList } from "@/components/ArticleList";
import { ARTICLES_QUERY } from "@/lib/queries/articles";

// テスト用ラップヘルパー
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

const mockArticles = {
  request: {
    query: ARTICLES_QUERY,
    variables: { first: 10 },
  },
  result: {
    data: {
      articles: {
        nodes: [
          {
            id: "1",
            title: "テスト記事1",
            body: "本文1",
            status: "published",
            createdAt: "2024-01-01T00:00:00Z",
            user: { name: "テストユーザー", email: "test@example.com" },
            tags: [{ id: "t1", name: "rails" }],
          },
          {
            id: "2",
            title: "テスト記事2",
            body: "本文2",
            status: "draft",
            createdAt: "2024-01-02T00:00:00Z",
            user: { name: null, email: "other@example.com" },
            tags: [],
          },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  },
};

describe("ArticleList", () => {
  it("ローディング中は「読み込み中...」を表示する", () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("記事一覧を表示する", async () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    await waitFor(() => {
      expect(screen.getByText("テスト記事1")).toBeInTheDocument();
      expect(screen.getByText("テスト記事2")).toBeInTheDocument();
    });
  });

  it("記事タイトルが詳細ページへのリンクになっている", async () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    await waitFor(() => {
      const link = screen.getByRole("link", { name: "テスト記事1" });
      expect(link).toHaveAttribute("href", "/articles/1");
    });
  });

  it("タグが表示される", async () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    await waitFor(() => {
      expect(screen.getByText("rails")).toBeInTheDocument();
    });
  });

  it("name が null の場合は email を表示する", async () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    await waitFor(() => {
      expect(screen.getByText("other@example.com")).toBeInTheDocument();
    });
  });

  it("hasNextPage が false の場合「もっと見る」ボタンを表示しない", async () => {
    renderWithProviders(<ArticleList />, [mockArticles]);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "もっと見る" })).not.toBeInTheDocument();
    });
  });
});
