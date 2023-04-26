const { runAll, getChecks } = require('./index');

function runWithOptions(sbom, options = {}) {
  const startTime = Date.now();
  const results = runAll(sbom, options);

  const summary = {
    totalChecks: results.length,
    errors: 0,
    warnings: 0,
    infos: 0,
    passed: 0,
    duration: 0
  };

  for (const r of results) {
    if (r.findings.length === 0) {
      summary.passed++;
      continue;
    }
    for (const f of r.findings) {
      if (f.severity === 'error') summary.errors++;
      else if (f.severity === 'warning') summary.warnings++;
      else summary.infos++;
    }
  }

  summary.duration = Date.now() - startTime;

  return {
    checks: results,
    summary,
    metadata: {
      sbomFormat: sbom.bomFormat || sbom.spdxVersion || 'unknown',
      componentCount: (sbom.components || []).length,
      timestamp: new Date().toISOString()
    }
  };
}

function listChecks(options = {}) {
  const checks = getChecks();
  if (options.category) {
    return checks.filter(c => c.id.startsWith(options.category));
  }
  return checks;
}

module.exports = { runWithOptions, listChecks };
