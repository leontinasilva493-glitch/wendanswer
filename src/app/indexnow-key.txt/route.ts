import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export function GET() {
  const configuredKey = process.env.INDEXNOW_KEY;
  if (!configuredKey) notFound();

  return new Response(configuredKey, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
