import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { SiteHeader } from "@/components/SiteHeader";

const mockUsePathname = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ usePathname: mockUsePathname }));
vi.mock("@/components/LogoutButton", () => ({
  LogoutButton: () => <button>ログアウト</button>,
}));

function renderSiteHeader() {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja">
        <SiteHeader />
      </IntlProvider>
    </ThemeProvider>
  );
}

describe("SiteHeader", () => {
  it("サイト名・ナビリンクが表示される", () => {
    mockUsePathname.mockReturnValue("/");
    renderSiteHeader();
    expect(screen.getByText("Rails Sandbox")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "記事一覧" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "タグ一覧" })).toBeInTheDocument();
  });

  it("/articles 配下のとき「記事一覧」が current になる", () => {
    mockUsePathname.mockReturnValue("/articles");
    renderSiteHeader();
    expect(screen.getByRole("link", { name: "記事一覧" })).toHaveAttribute("aria-current", "page");
  });

  it("/tags 配下のとき「タグ一覧」が current になる", () => {
    mockUsePathname.mockReturnValue("/tags");
    renderSiteHeader();
    expect(screen.getByRole("link", { name: "タグ一覧" })).toHaveAttribute("aria-current", "page");
  });

  it("/ のときどのリンクも current でない", () => {
    mockUsePathname.mockReturnValue("/");
    renderSiteHeader();
    expect(screen.getByRole("link", { name: "記事一覧" })).not.toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "タグ一覧" })).not.toHaveAttribute("aria-current", "page");
  });
});
