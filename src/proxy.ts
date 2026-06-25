import { NextResponse, type NextRequest } from "next/server";

const legacyWendArchivePrefix = "/linkedin-wend-answer-";
const canonicalWendArchivePrefix = "/wend-answer-puzzle-";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith(legacyWendArchivePrefix)) {
    const slug = pathname.slice(legacyWendArchivePrefix.length);
    const url = request.nextUrl.clone();
    url.pathname = `${canonicalWendArchivePrefix}${slug}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
