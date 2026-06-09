import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { ArticleForm } from "@/components/ArticleForm";
import { CREATE_ARTICLE, UPDATE_ARTICLE } from "@/lib/queries/article";

// next/navigation のモック
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
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

describe("ArticleForm — 新規作成モード", () => {
  it("タイトル未入力で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ArticleForm />);

    await user.click(screen.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(screen.getByText("タイトルは必須です")).toBeInTheDocument();
    });
  });

  it("本文未入力で送信するとバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ArticleForm />);

    await user.type(screen.getByLabelText(/タイトル/), "テストタイトル");
    await user.click(screen.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(screen.getByText("本文は必須です")).toBeInTheDocument();
    });
  });

  it("101文字以上のタイトルでバリデーションエラーを表示する", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ArticleForm />);

    await user.type(screen.getByLabelText(/タイトル/), "a".repeat(101));
    await user.click(screen.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(screen.getByText("タイトルは100文字以内で入力してください")).toBeInTheDocument();
    });
  });

  it("送信成功後に記事詳細ページへ遷移する", async () => {
    const user = userEvent.setup();
    const createMock = {
      request: {
        query: CREATE_ARTICLE,
        variables: { title: "新しい記事", body: "本文テキスト" },
      },
      result: {
        data: {
          createArticle: {
            article: { id: "42" },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<ArticleForm />, [createMock]);

    await user.type(screen.getByLabelText(/タイトル/), "新しい記事");
    await user.type(screen.getByLabelText(/本文/), "本文テキスト");
    await user.click(screen.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/articles/42");
    });
  });

  it("GraphQL エラー時に root エラーを表示する", async () => {
    const user = userEvent.setup();
    const errorMock = {
      request: {
        query: CREATE_ARTICLE,
        variables: { title: "エラー記事", body: "本文" },
      },
      result: {
        data: {
          createArticle: {
            article: null,
            errors: ["ログインが必要です"],
          },
        },
      },
    };

    renderWithProviders(<ArticleForm />, [errorMock]);

    await user.type(screen.getByLabelText(/タイトル/), "エラー記事");
    await user.type(screen.getByLabelText(/本文/), "本文");
    await user.click(screen.getByRole("button", { name: "作成する" }));

    await waitFor(() => {
      expect(screen.getByText("ログインが必要です")).toBeInTheDocument();
    });
  });
});

describe("ArticleForm — 編集モード", () => {
  const editProps = {
    articleId: "1",
    lockVersion: 0,
    defaultValues: {
      title: "既存タイトル",
      body: "既存本文",
      status: "draft" as const,
    },
  };

  it("defaultValues がフォームに表示される", () => {
    renderWithProviders(<ArticleForm {...editProps} />);
    expect(screen.getByDisplayValue("既存タイトル")).toBeInTheDocument();
    expect(screen.getByDisplayValue("既存本文")).toBeInTheDocument();
  });

  it("ステータス選択が表示される", () => {
    renderWithProviders(<ArticleForm {...editProps} />);
    expect(screen.getByLabelText(/ステータス/)).toBeInTheDocument();
  });

  it("送信成功後に記事詳細ページへ遷移する", async () => {
    const user = userEvent.setup();
    const updateMock = {
      request: {
        query: UPDATE_ARTICLE,
        variables: {
          id: "1",
          title: "更新タイトル",
          body: "既存本文",
          status: "draft",
          lockVersion: 0,
        },
      },
      result: {
        data: {
          updateArticle: {
            article: { id: "1", title: "更新タイトル", body: "既存本文", status: "draft", lockVersion: 1 },
            errors: [],
          },
        },
      },
    };

    renderWithProviders(<ArticleForm {...editProps} />, [updateMock]);

    const titleInput = screen.getByDisplayValue("既存タイトル");
    await user.clear(titleInput);
    await user.type(titleInput, "更新タイトル");
    await user.click(screen.getByRole("button", { name: "更新する" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/articles/1");
    });
  });
});
