function diffComponents(before, after) {
  const beforeMap = new Map();
  const afterMap = new Map();

  for (const c of before) beforeMap.set(c.name, c);
  for (const c of after) afterMap.set(c.name, c);

  const added = [];
  const removed = [];
  const changed = [];

  for (const [name, comp] of afterMap) {
    if (!beforeMap.has(name)) {
      added.push(comp);
    } else {
      const old = beforeMap.get(name);
      if (old.version !== comp.version) {
        changed.push({ name, from: old.version, to: comp.version });
      }
    }
  }

  for (const [name, comp] of beforeMap) {
    if (!afterMap.has(name)) {
      removed.push(comp);
    }
  }

  return { added, removed, changed };
}

function diffScores(before, after) {
  return {
    overall: after.overall - before.overall,
    components: after.components.average - before.components.average,
    metadata: after.metadata - before.metadata,
    dependencies: after.dependencyCoverage - before.dependencyCoverage
  };
}

function diffResults(before, after) {
  const componentDiff = diffComponents(
    before.checks.flatMap(c => c.findings.filter(f => f.component).map(f => ({ name: f.component, version: f.version }))),
    after.checks.flatMap(c => c.findings.filter(f => f.component).map(f => ({ name: f.component, version: f.version })))
  );

  return {
    scoreDelta: diffScores(before.score, after.score),
    componentDiff,
    findingsDelta: countFindings(after) - countFindings(before)
  };
}

function countFindings(result) {
  let count = 0;
  for (const check of result.checks) {
    count += check.findings.length;
  }
  return count;
}

module.exports = { diffComponents, diffScores, diffResults };
