import { NextResponse } from "next/server";
import { authorizeBearer, buildRepositoryDispatch, githubRepositoryDispatchUrl } from "@/lib/wend-dispatch";
import { expectedWendDate } from "@/lib/wend-schedule";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function dispatch(request: Request) {
  if (!authorizeBearer(request.headers.get("Authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const repository = process.env.WEND_GITHUB_REPOSITORY;
  if (!token || !repository) {
    return NextResponse.json({ error: "Dispatch service is not configured." }, { status: 503 });
  }

  let endpoint: string;
  try {
    endpoint = githubRepositoryDispatchUrl(repository);
  } catch {
    return NextResponse.json({ error: "Dispatch service is not configured." }, { status: 503 });
  }

  const expectedDate = expectedWendDate();
  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify(buildRepositoryDispatch(expectedDate)),
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      method: "POST",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "GitHub rejected the dispatch request." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "GitHub dispatch is temporarily unavailable." }, { status: 502 });
  }

  return NextResponse.json(
    { expectedDate, status: "dispatched" },
    { headers: { "Cache-Control": "no-store" }, status: 202 },
  );
}

export const GET = dispatch;
export const POST = dispatch;
