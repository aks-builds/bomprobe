function matchPattern(name, pattern) {
  if (pattern.startsWith('*') && pattern.endsWith('*')) {
    return name.includes(pattern.slice(1, -1));
  }
  if (pattern.startsWith('*')) {
    return name.endsWith(pattern.slice(1));
  }
  if (pattern.endsWith('*')) {
    return name.startsWith(pattern.slice(0, -1));
  }
  return name === pattern;
}

function createFilter(patterns) {
  if (!patterns || patterns.length === 0) return () => true;
  return (component) => {
    const name = component.name || '';
    return !patterns.some(p => matchPattern(name, p));
  };
}

function filterComponents(components, ignorePatterns) {
  const filter = createFilter(ignorePatterns);
  return components.filter(filter);
}

module.exports = { matchPattern, createFilter, filterComponents };
