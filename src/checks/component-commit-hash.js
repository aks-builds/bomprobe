const SHA1_RE = /^[0-9a-f]{40}$/;

module.exports = {
  id: 'component-commit-hash',
  name: 'Component Commit Hash',
  description: 'Components with pedigree commits should have valid SHA-1 hashes',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const commits = c.pedigree?.commits || [];
      for (const commit of commits) {
        const uid = commit.uid || '';
        if (uid && !SHA1_RE.test(uid)) {
          findings.push({
            severity: 'warning',
            component: c.name,
            message: `${c.name || 'Unnamed'} has invalid commit hash: ${uid.slice(0, 12)}...`
          });
        }
      }
    }
    return findings;
  }
};
