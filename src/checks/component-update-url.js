module.exports = {
  id: 'component-update-url',
  name: 'Component Update URL',
  description: 'Components should have advisories or issue-tracker references for update tracking',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const refs = c.externalReferences || [];
      const hasAdvisories = refs.some(r => r.type === 'advisories');
      const hasIssueTracker = refs.some(r => r.type === 'issue-tracker');
      const hasWebsite = refs.some(r => r.type === 'website');

      if (!hasAdvisories && !hasIssueTracker && !hasWebsite) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no advisories, issue-tracker, or website reference`
        });
      }
    }
    return findings;
  }
};
