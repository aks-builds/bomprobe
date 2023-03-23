module.exports = {
  id: 'duplicate-components',
  name: 'Duplicate Components',
  description: 'Each component should appear only once in the SBOM',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    const seen = new Map();

    for (const c of sbom.components) {
      const key = `${c.name || ''}@${c.version || ''}`;
      if (seen.has(key)) {
        seen.set(key, seen.get(key) + 1);
      } else {
        seen.set(key, 1);
      }
    }

    for (const [key, count] of seen) {
      if (count > 1) {
        findings.push({
          severity: 'warning',
          component: key,
          message: `${key} appears ${count} times in the SBOM`
        });
      }
    }

    return findings;
  }
};
