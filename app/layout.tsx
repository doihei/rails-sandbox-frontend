import type { Metadata } from "next";
import "smarthr-ui/smarthr-ui.css";
import { Providers } from "@/components/Providers";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
