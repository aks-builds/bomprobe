function evaluatePolicy(policy, auditResult) {
  if (!policy || typeof policy !== 'object') return { pass: true, violations: [] };

  const violations = [];

  if (typeof policy.minScore === 'number' && auditResult.score < policy.minScore) {
    violations.push({
      rule: 'minScore',
      expected: policy.minScore,
      actual: auditResult.score,
      message: `Score ${auditResult.score} is below minimum ${policy.minScore}`
    });
  }

  if (policy.maxFindings) {
    const counts = countBySeverity(auditResult.findings || []);
    for (const [sev, max] of Object.entries(policy.maxFindings)) {
      const actual = counts[sev] || 0;
      if (actual > max) {
        violations.push({
          rule: 'maxFindings',
          severity: sev,
          expected: max,
          actual,
          message: `${actual} ${sev} findings exceed limit of ${max}`
        });
      }
    }
  }

  if (Array.isArray(policy.requiredChecks)) {
    const passedChecks = new Set((auditResult.checks || []).filter(c => c.pass).map(c => c.id));
    for (const reqId of policy.requiredChecks) {
      if (!passedChecks.has(reqId)) {
        violations.push({
          rule: 'requiredChecks',
          checkId: reqId,
          message: `Required check '${reqId}' did not pass`
        });
      }
    }
  }

  if (Array.isArray(policy.bannedLicenses)) {
    const banned = new Set(policy.bannedLicenses.map(l => l.toLowerCase()));
    const components = Array.isArray(auditResult.components) ? auditResult.components : [];
    for (const comp of components) {
      const licenses = extractLicenseIds(comp);
      for (const lic of licenses) {
        if (banned.has(lic.toLowerCase())) {
          violations.push({
            rule: 'bannedLicenses',
            license: lic,
            component: `${comp.name || 'unknown'}@${comp.version || 'unknown'}`,
            message: `Banned license '${lic}' found in ${comp.name || 'unknown'}`
          });
        }
      }
    }
  }

  if (typeof policy.maxAge === 'number' && Array.isArray(auditResult.ageResults)) {
    for (const r of auditResult.ageResults) {
      if (r.ageInDays !== null && r.ageInDays > policy.maxAge) {
        violations.push({
          rule: 'maxAge',
          component: `${r.name}@${r.version}`,
          ageInDays: r.ageInDays,
          limit: policy.maxAge,
          message: `${r.name}@${r.version} is ${r.ageInDays} days old, exceeds ${policy.maxAge}`
        });
      }
    }
  }

  if (typeof policy.minFieldCoverage === 'number') {
    const coverage = auditResult.fieldCoverage || 0;
    if (coverage < policy.minFieldCoverage) {
      violations.push({
        rule: 'minFieldCoverage',
        expected: policy.minFieldCoverage,
        actual: coverage,
        message: `Field coverage ${coverage}% is below minimum ${policy.minFieldCoverage}%`
      });
    }
  }

  return {
    pass: violations.length === 0,
    violations,
    policyName: policy.name || 'unnamed',
    evaluatedAt: new Date().toISOString()
  };
}

function extractLicenseIds(component) {
  if (!component) return [];
  const ids = [];
  if (Array.isArray(component.licenses)) {
    for (const lic of component.licenses) {
      if (lic?.license?.id) ids.push(lic.license.id);
      if (lic?.license?.name) ids.push(lic.license.name);
      if (lic?.expression) ids.push(lic.expression);
    }
  }
  return ids;
}

function countBySeverity(findings) {
  const counts = {};
  for (const f of findings) {
    const sev = f.severity || 'unknown';
    counts[sev] = (counts[sev] || 0) + 1;
  }
  return counts;
}

function formatPolicyResult(result) {
  const lines = [];
  lines.push(`Policy: ${result.policyName}`);
  lines.push(`Result: ${result.pass ? 'PASS' : 'FAIL'}`);

  if (result.violations.length > 0) {
    lines.push(`\nViolations (${result.violations.length}):`);
    for (const v of result.violations) {
      lines.push(`  [${v.rule}] ${v.message}`);
    }
  }

  return lines.join('\n');
}

const PRESETS = {
  strict: {
    name: 'strict',
    minScore: 80,
    maxFindings: { error: 0 },
    minFieldCoverage: 70
  },
  moderate: {
    name: 'moderate',
    minScore: 60,
    maxFindings: { error: 5 },
    minFieldCoverage: 50
  },
  permissive: {
    name: 'permissive',
    minScore: 30,
    maxFindings: { error: 20 }
  }
};

function getPreset(name) {
  return PRESETS[name] || null;
}

module.exports = { evaluatePolicy, formatPolicyResult, getPreset, PRESETS, countBySeverity, extractLicenseIds };
