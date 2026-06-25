import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { MockLink } from "@apollo/client/testing";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { TagList } from "@/components/tags/TagList";
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
    variables: { first: 20 },
  },
  result: {
    data: {
      tags: {
        nodes: [
          { id: "t1", name: "rails", articlesCount: 10 },
          { id: "t2", name: "typescript", articlesCount: 5 },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    },
  },
};

const mockTagsWithNextPage = {
  request: {
    query: GET_TAGS,
    variables: { first: 20 },
  },
  result: {
    data: {
      tags: {
        nodes: [
          { id: "t1", name: "rails", articlesCount: 10 },
        ],
        pageInfo: { hasNextPage: true, endCursor: "cursor-xyz" },
      },
    },
  },
};

describe("TagList", () => {
  it("ローディング中は「読み込み中...」を表示する", () => {
    renderWithProviders(<TagList />, [mockTags]);
    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("タグ名が表示される", async () => {
    renderWithProviders(<TagList />, [mockTags]);
    await waitFor(() => {
      expect(screen.getByText("rails")).toBeInTheDocument();
      expect(screen.getByText("typescript")).toBeInTheDocument();
    });
  });

  it("タグが各タグページへのリンクになっている", async () => {
    renderWithProviders(<TagList />, [mockTags]);
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /rails/ });
      expect(link).toHaveAttribute("href", "/tags/t1");
    });
  });

  it("hasNextPage が false のとき「もっと見る」ボタンを表示しない", async () => {
    renderWithProviders(<TagList />, [mockTags]);
    await waitFor(() => {
      expect(screen.getByText("rails")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "もっと見る" })).not.toBeInTheDocument();
  });

  it("hasNextPage が true のとき「もっと見る」ボタンを表示する", async () => {
    renderWithProviders(<TagList />, [mockTagsWithNextPage]);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "もっと見る" })).toBeInTheDocument();
    });
  });
});
