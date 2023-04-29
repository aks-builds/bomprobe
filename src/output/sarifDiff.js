function diffSarifResults(before, after) {
  const beforeIds = new Set();
  for (const r of (before.runs?.[0]?.results || [])) {
    beforeIds.add(`${r.ruleId}:${r.message?.text || ''}`);
  }

  const afterIds = new Set();
  for (const r of (after.runs?.[0]?.results || [])) {
    afterIds.add(`${r.ruleId}:${r.message?.text || ''}`);
  }

  const newFindings = [];
  const fixedFindings = [];

  for (const r of (after.runs?.[0]?.results || [])) {
    const key = `${r.ruleId}:${r.message?.text || ''}`;
    if (!beforeIds.has(key)) {
      newFindings.push(r);
    }
  }

  for (const r of (before.runs?.[0]?.results || [])) {
    const key = `${r.ruleId}:${r.message?.text || ''}`;
    if (!afterIds.has(key)) {
      fixedFindings.push(r);
    }
  }

  return {
    newFindings,
    fixedFindings,
    beforeCount: beforeIds.size,
    afterCount: afterIds.size,
    delta: afterIds.size - beforeIds.size
  };
}

module.exports = { diffSarifResults };
