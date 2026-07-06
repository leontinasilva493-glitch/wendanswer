import assert from "node:assert/strict";
import { allowsGlobalCrawl, disallowsGlobalCrawl } from "../scripts/robots-policy.mjs";

const cloudflareStyleRobots = `# BEGIN Cloudflare Managed content

User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: Amazonbot
Disallow: /

User-agent: ClaudeBot
Disallow: /

# END Cloudflare Managed Content

User-Agent: *
Allow: /

Sitemap: https://wendanswertoday.org/sitemap.xml
`;

const blockedRobots = `User-agent: *
Disallow: /
`;

assert.equal(allowsGlobalCrawl(cloudflareStyleRobots), true, "Cloudflare-style robots should allow global crawl");
assert.equal(disallowsGlobalCrawl(cloudflareStyleRobots), false, "bot-specific disallow blocks should not count as whole-site disallow");
assert.equal(allowsGlobalCrawl(blockedRobots), false, "a strict disallow-only robots file should not allow crawl");
assert.equal(disallowsGlobalCrawl(blockedRobots), true, "a strict disallow-only robots file should block crawl");

console.log("robots policy test passed");
