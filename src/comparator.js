const { parse } = require('./parsers');

function compare(fileA, fileB) {
  const a = parse(fileA);
  const b = parse(fileB);

  if (a.error) return { error: `File A: ${a.error}` };
  if (b.error) return { error: `File B: ${b.error}` };

  const sbomA = a.sbom;
  const sbomB = b.sbom;

  const namesA = new Set(sbomA.components.map(c => c.name));
  const namesB = new Set(sbomB.components.map(c => c.name));

  const added = [...namesB].filter(n => !namesA.has(n));
  const removed = [...namesA].filter(n => !namesB.has(n));
  const common = [...namesA].filter(n => namesB.has(n));

  const versionChanges = [];
  for (const name of common) {
    const compA = sbomA.components.find(c => c.name === name);
    const compB = sbomB.components.find(c => c.name === name);
    if (compA.version !== compB.version) {
      versionChanges.push({ name, from: compA.version, to: compB.version });
    }
  }

  return {
    fileA,
    fileB,
    formatA: sbomA.format,
    formatB: sbomB.format,
    componentCountA: sbomA.components.length,
    componentCountB: sbomB.components.length,
    added,
    removed,
    versionChanges,
    unchanged: common.length - versionChanges.length
  };
}

module.exports = { compare };
