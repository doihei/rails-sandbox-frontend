import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/auth';

// 認証不要のパス
const PUBLIC_PATHS = ['/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要パスはスルー
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // トークンがない場合はログインページへリダイレクト
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // ログイン後にリダイレクトするためのパラメータ
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 静的ファイル・_next・APIルートは除外
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
