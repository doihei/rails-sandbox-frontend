import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { MarkdownToc } from "@/components/markdown/MarkdownToc";

function renderToc(content: string) {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja">
        <MarkdownToc content={content} />
      </IntlProvider>
    </ThemeProvider>
  );
}

describe("MarkdownToc", () => {
  it("見出しがない場合は何も描画しない", () => {
    const { container } = renderToc("見出しのないテキスト");
    expect(container).toBeEmptyDOMElement();
  });

  it("空文字列では何も描画しない", () => {
    const { container } = renderToc("");
    expect(container).toBeEmptyDOMElement();
  });

  it("見出しがあると nav[aria-label='目次'] が描画される", () => {
    renderToc("# 見出し1");
    expect(screen.getByRole("navigation", { name: "目次" })).toBeInTheDocument();
  });

  it("h1・h2・h3 の 3 件がリンクとして描画される", () => {
    renderToc("# 見出し1\n## 見出し2\n### 見出し3");
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("リンクの href が slugify 済みの id を参照している", () => {
    renderToc("# 見出し1\n## Hello World");
    expect(screen.getByRole("link", { name: "見出し1" })).toHaveAttribute("href", "#見出し1");
    expect(screen.getByRole("link", { name: "Hello World" })).toHaveAttribute("href", "#hello-world");
  });

  it("コードブロック内の # を見出しとして抽出しない", () => {
    const content = "# 本物の見出し\n```\n# コードブロック内\n```";
    renderToc(content);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "#本物の見出し");
  });

  it("h3 から始まる文書で最小レベルを基準にインデントが 0 になる", () => {
    renderToc("### h3 見出し\n#### h4 見出し");
    // h3 は minLevel(=3) のためインデント 0px
    const h3Item = screen.getByRole("link", { name: "h3 見出し" }).closest("li");
    expect(h3Item).toHaveStyle({ paddingLeft: "0px" });
    // h4 は (4-3)*12 = 12px
    const h4Item = screen.getByRole("link", { name: "h4 見出し" }).closest("li");
    expect(h4Item).toHaveStyle({ paddingLeft: "12px" });
  });
});
