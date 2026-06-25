import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { ArticleTable } from "@/components/articles/ArticleTable";

function renderWithProviders(ui: React.ReactElement) {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja">
        {ui}
      </IntlProvider>
    </ThemeProvider>
  );
}

const mockArticles = [
  {
    id: "1",
    title: "テスト記事1",
    status: "published",
    commentsCount: 2,
    user: { name: "テストユーザー", email: "test@example.com" },
    tags: [{ id: "t1", name: "rails" }],
  },
  {
    id: "2",
    title: "テスト記事2",
    status: "draft",
    commentsCount: 0,
    user: { name: null, email: "other@example.com" },
    tags: [],
  },
];

describe("ArticleTable", () => {
  it("記事タイトル・著者・タグが表示される", () => {
    renderWithProviders(<ArticleTable articles={mockArticles} />);
    expect(screen.getByText(/テスト記事1/)).toBeInTheDocument();
    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    expect(screen.getByText("rails")).toBeInTheDocument();
  });

  it("name が null の場合は email を表示する", () => {
    renderWithProviders(<ArticleTable articles={mockArticles} />);
    expect(screen.getByText("other@example.com")).toBeInTheDocument();
  });

  it("タイトルが詳細ページへのリンクになっている", () => {
    renderWithProviders(<ArticleTable articles={mockArticles} />);
    const link = screen.getByRole("link", { name: /テスト記事1/ });
    expect(link).toHaveAttribute("href", "/articles/1");
  });

  it("pageInfo がないとき「もっと見る」ボタンを表示しない", () => {
    renderWithProviders(<ArticleTable articles={mockArticles} />);
    expect(screen.queryByRole("button", { name: "もっと見る" })).not.toBeInTheDocument();
  });

  it("hasNextPage が true で onFetchMore があるとき「もっと見る」ボタンを表示する", () => {
    renderWithProviders(
      <ArticleTable
        articles={mockArticles}
        pageInfo={{ hasNextPage: true, endCursor: "cursor-abc" }}
        onFetchMore={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "もっと見る" })).toBeInTheDocument();
  });

  it("「もっと見る」クリックで onFetchMore が呼ばれる", async () => {
    const user = userEvent.setup();
    const onFetchMore = vi.fn();
    renderWithProviders(
      <ArticleTable
        articles={mockArticles}
        pageInfo={{ hasNextPage: true, endCursor: "cursor-abc" }}
        onFetchMore={onFetchMore}
      />
    );
    await user.click(screen.getByRole("button", { name: "もっと見る" }));
    expect(onFetchMore).toHaveBeenCalledOnce();
  });
});
