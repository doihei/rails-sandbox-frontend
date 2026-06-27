import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import ArticleDetailPage from "@/app/articles/[id]/page";
import { GET_ARTICLE } from "@/lib/queries/article";

// next/navigation のモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useRouter: () => ({ push: mockPush }),
}));

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

// 共通モックデータ
const makeArticleMock = (meId: string | null) => ({
  request: {
    query: GET_ARTICLE,
    variables: { id: "1" },
  },
  result: {
    data: {
      article: {
        id: "1",
        title: "テスト記事",
        body: "本文テキスト",
        status: "published",
        lockVersion: 0,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        likesCount: 0,
        likedByMe: false,
        commentsCount: 0,
        comments: [],
        user: { id: "user-1", name: "著者", email: "author@example.com" },
        tags: [{ id: "t1", name: "rails" }],
      },
      me: meId ? { id: meId } : null,
    },
  },
});

describe("ArticleDetailPage", () => {
  it("記事タイトルと本文を表示する", async () => {
    renderWithProviders(<ArticleDetailPage />, [makeArticleMock("user-1")]);
    await waitFor(() => {
      expect(screen.getByText("テスト記事")).toBeInTheDocument();
      expect(screen.getByText("本文テキスト")).toBeInTheDocument();
    });
  });

  it("オーナーの場合は編集・削除ボタンを表示する", async () => {
    renderWithProviders(<ArticleDetailPage />, [makeArticleMock("user-1")]);
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "編集" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
    });
  });

  it("別ユーザーの場合は編集・削除ボタンを表示しない", async () => {
    renderWithProviders(<ArticleDetailPage />, [makeArticleMock("other-user")]);
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "編集" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "削除" })).not.toBeInTheDocument();
    });
  });

  it("未認証（me が null）の場合は編集・削除ボタンを表示しない", async () => {
    renderWithProviders(<ArticleDetailPage />, [makeArticleMock(null)]);
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "編集" })).not.toBeInTheDocument();
    });
  });

  it("タグが表示される", async () => {
    renderWithProviders(<ArticleDetailPage />, [makeArticleMock("user-1")]);
    await waitFor(() => {
      expect(screen.getByText("rails")).toBeInTheDocument();
    });
  });

  it("存在しない記事の場合はエラーメッセージを表示する", async () => {
    const notFoundMock = {
      request: { query: GET_ARTICLE, variables: { id: "1" } },
      result: { data: { article: null, me: null } },
    };
    renderWithProviders(<ArticleDetailPage />, [notFoundMock]);
    await waitFor(() => {
      expect(screen.getByText("記事が見つかりません")).toBeInTheDocument();
    });
  });
});
