function normalizeLine(line) {
  return line.replace(/\r$/, "").trim();
}

function isDirective(line, name) {
  return new RegExp(`^${name}:`, "i").test(line);
}

function directiveValue(line) {
  const index = line.indexOf(":");
  if (index === -1) return "";
  return line.slice(index + 1).trim();
}

function parseRobotsGroups(robotsText) {
  const groups = [];
  let current = { userAgents: [], directives: [] };

  for (const rawLine of robotsText.split(/\n/)) {
    const line = normalizeLine(rawLine);
    if (!line || line.startsWith("#")) {
      if (current.userAgents.length || current.directives.length) {
        groups.push(current);
        current = { userAgents: [], directives: [] };
      }
      continue;
    }

    if (isDirective(line, "user-agent")) {
      current.userAgents.push(directiveValue(line).toLowerCase());
      continue;
    }

    current.directives.push(line);
  }

  if (current.userAgents.length || current.directives.length) groups.push(current);
  return groups;
}

export function allowsGlobalCrawl(robotsText) {
  return parseRobotsGroups(robotsText).some((group) => {
    const appliesToAll = group.userAgents.includes("*");
    if (!appliesToAll) return false;
    return group.directives.some((line) => /^allow:\s*\/\s*$/i.test(line));
  });
}

export function disallowsGlobalCrawl(robotsText) {
  return parseRobotsGroups(robotsText).some((group) => {
    const appliesToAll = group.userAgents.includes("*");
    if (!appliesToAll) return false;

    const hasRootAllow = group.directives.some((line) => /^allow:\s*\/\s*$/i.test(line));
    const hasRootDisallow = group.directives.some((line) => /^disallow:\s*\/\s*$/i.test(line));
    return hasRootDisallow && !hasRootAllow;
  });
}
