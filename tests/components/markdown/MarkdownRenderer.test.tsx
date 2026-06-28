import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, IntlProvider, createTheme } from "smarthr-ui";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";

function renderMarkdown(content: string) {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <IntlProvider locale="ja">
        <MarkdownRenderer content={content} />
      </IntlProvider>
    </ThemeProvider>
  );
}

describe("MarkdownRenderer", () => {
  describe("見出し ID 付与", () => {
    it("h1 に slugify 済みの id が付与される（日本語）", () => {
      renderMarkdown("# 見出し1");
      expect(document.querySelector("h1")?.id).toBe("見出し1");
    });

    it("h2 に slugify 済みの id が付与される（ASCII）", () => {
      renderMarkdown("## Hello World");
      expect(document.querySelector("h2")?.id).toBe("hello-world");
    });

    it("h3 が正しくレンダリングされる", () => {
      renderMarkdown("### サブ見出し");
      expect(document.querySelector("h3")).toBeInTheDocument();
    });
  });

  describe("リンク", () => {
    it("target='_blank' と rel='noopener noreferrer' が付与される", () => {
      renderMarkdown("[テスト](https://example.com)");
      const link = screen.getByRole("link", { name: "テスト" });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("コードブロック", () => {
    it("pre と code がレンダリングされる", () => {
      renderMarkdown("```ts\nconst x = 1\n```");
      expect(document.querySelector("pre")).toBeInTheDocument();
      expect(document.querySelector("code")).toBeInTheDocument();
    });
  });

  describe("XSS 対策", () => {
    it("script タグが DOM に存在しない", () => {
      renderMarkdown("<script>alert('xss')</script>");
      expect(document.querySelector("script")).not.toBeInTheDocument();
    });
  });

  describe("エッジケース", () => {
    it("空文字列でもエラーなくレンダリングされる", () => {
      expect(() => renderMarkdown("")).not.toThrow();
    });
  });
});
