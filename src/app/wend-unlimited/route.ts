import { NextResponse } from "next/server";

function redirectToPlay(request: Request) {
  return NextResponse.redirect(new URL("/play-wend", request.url), 308);
}

export function GET(request: Request) {
  return redirectToPlay(request);
}

export function HEAD(request: Request) {
  return redirectToPlay(request);
}
