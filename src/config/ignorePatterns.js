function parseIgnoreFile(content) {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(pattern => ({ pattern, regex: patternToRegex(pattern) }));
}

function patternToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

function shouldIgnore(componentName, patterns) {
  for (const p of patterns) {
    if (p.regex.test(componentName)) return true;
  }
  return false;
}

function filterFindings(findings, ignorePatterns) {
  if (!ignorePatterns || ignorePatterns.length === 0) return findings;
  return findings.filter(f => {
    const name = f.component || '';
    return !shouldIgnore(name, ignorePatterns);
  });
}

module.exports = { parseIgnoreFile, shouldIgnore, filterFindings, patternToRegex };
