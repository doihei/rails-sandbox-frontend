import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { ArticleList } from "@/components/ArticleList";
import { ARTICLES_QUERY } from "@/lib/queries/articles";
import { ThemeProvider, createTheme } from "smarthr-ui";
import { IntlProvider } from "react-intl";

const theme = createTheme();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <IntlProvider locale="ja">
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </IntlProvider>
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
            body: "本文テスト1",
            status: "published",
            createdAt: "2025-01-01T00:00:00Z",
            user: { name: "テストユーザー", email: "test@example.com" },
            tags: [{ id: "t1", name: "Rails" }],
          },
          {
            id: "2",
            title: "テスト記事2",
            body: "本文テスト2",
            status: "draft",
            createdAt: "2025-01-02T00:00:00Z",
            user: { name: null, email: "test2@example.com" },
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
    renderWithProviders(
      <MockedProvider mocks={[mockArticles]}>
        <ArticleList />
      </MockedProvider>
    );
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("記事一覧がテーブルに表示される", async () => {
    renderWithProviders(
      <MockedProvider mocks={[mockArticles]}>
        <ArticleList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("テスト記事1")).toBeInTheDocument();
      expect(screen.getByText("テスト記事2")).toBeInTheDocument();
    });
  });

  it("published 記事のステータスラベルが表示される", async () => {
    renderWithProviders(
      <MockedProvider mocks={[mockArticles]}>
        <ArticleList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("published")).toBeInTheDocument();
    });
  });

  it("name が null のユーザーは email を表示する", async () => {
    renderWithProviders(
      <MockedProvider mocks={[mockArticles]}>
        <ArticleList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("test2@example.com")).toBeInTheDocument();
    });
  });

  it("hasNextPage が false のとき「もっと見る」ボタンが表示されない", async () => {
    renderWithProviders(
      <MockedProvider mocks={[mockArticles]}>
        <ArticleList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("もっと見る")).not.toBeInTheDocument();
    });
  });

  it("hasNextPage が true のとき「もっと見る」ボタンが表示される", async () => {
    const mockWithNextPage = {
      ...mockArticles,
      result: {
        data: {
          articles: {
            ...mockArticles.result.data.articles,
            pageInfo: { hasNextPage: true, endCursor: "cursor_abc" },
          },
        },
      },
    };

    renderWithProviders(
      <MockedProvider mocks={[mockWithNextPage]}>
        <ArticleList />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("もっと見る")).toBeInTheDocument();
    });
  });
});