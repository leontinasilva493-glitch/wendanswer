import { NextResponse } from "next/server";

function redirectToHome(request: Request) {
  return NextResponse.redirect(new URL("/", request.url), 301);
}

export function GET(request: Request) {
  return redirectToHome(request);
}

export function HEAD(request: Request) {
  return redirectToHome(request);
}
