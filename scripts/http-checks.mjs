export function redirectDestinationPath(location, baseUrl) {
  if (!location) return null;

  try {
    const paths = location
      .split(/\s*,\s*/)
      .filter(Boolean)
      .map((value) => new URL(value, baseUrl).pathname);
    const uniquePaths = new Set(paths);
    return uniquePaths.size === 1 ? paths[0] : null;
  } catch {
    return null;
  }
}
