function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function createReport(result, options = {}) {
  const startTime = options.startTime || Date.now();
  const duration = Date.now() - startTime;

  const checkResults = result.checks.map(c => ({
    id: c.id,
    name: c.name,
    passed: c.findings.length === 0,
    findingCount: c.findings.length,
    findings: c.findings
  }));

  const passed = checkResults.filter(c => c.passed).length;
  const failed = checkResults.filter(c => !c.passed).length;

  return {
    file: result.file,
    format: result.format,
    componentCount: result.componentCount,
    score: result.score,
    summary: {
      checksRun: checkResults.length,
      passed,
      failed,
      duration: formatDuration(duration)
    },
    checks: checkResults,
    compliance: result.compliance || null,
    generatedAt: new Date().toISOString()
  };
}

module.exports = { createReport, formatDuration };
