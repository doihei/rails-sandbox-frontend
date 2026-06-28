import type { Metadata } from "next";
import "smarthr-ui/smarthr-ui.css";
import "highlight.js/styles/github.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { getToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Rails Sandbox Frontend",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html lang="ja">
      <body>
        <Providers token={token}>
          {token && <SiteHeader />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
