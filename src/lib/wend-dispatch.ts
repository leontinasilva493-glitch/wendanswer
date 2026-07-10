export function authorizeBearer(header: string | null, secret: string | undefined) {
  if (!header?.startsWith("Bearer ") || !secret) return false;

  const token = header.slice("Bearer ".length);
  const length = Math.max(token.length, secret.length);
  let mismatch = token.length ^ secret.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (token.charCodeAt(index) || 0) ^ (secret.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

export function buildRepositoryDispatch(expectedDate: string) {
  return {
    event_type: "publish-wend-daily",
    client_payload: { expected_date: expectedDate },
  };
}

export function githubRepositoryDispatchUrl(repository: string) {
  const match = repository.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (!match) throw new Error("WEND_GITHUB_REPOSITORY must use the owner/repository format.");
  return `https://api.github.com/repos/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}/dispatches`;
}
