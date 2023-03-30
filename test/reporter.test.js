const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { generateReport } = require('../src/reporter');

describe('report generator', () => {
  const result = {
    file: 'sbom.json',
    format: 'cyclonedx',
    score: { overall: 7.5 },
    componentCount: 3,
    checks: [
      { id: 'a', name: 'Check A', findings: [] },
      { id: 'b', name: 'Check B', findings: [{ severity: 'warning', component: 'x', message: 'missing field' }] }
    ]
  };

  it('includes header with file info', () => {
    const report = generateReport(result);
    assert.ok(report.includes('sbom.json'));
    assert.ok(report.includes('cyclonedx'));
    assert.ok(report.includes('7.5/10'));
  });

  it('lists findings by check', () => {
    const report = generateReport(result);
    assert.ok(report.includes('Check B'));
    assert.ok(report.includes('missing field'));
  });

  it('shows no-findings message for clean results', () => {
    const clean = { ...result, checks: [{ id: 'a', name: 'A', findings: [] }] };
    const report = generateReport(clean);
    assert.ok(report.includes('meets all quality checks'));
  });

  it('includes compliance section when present', () => {
    const withCompliance = {
      ...result,
      compliance: { profile: 'ntia', compliant: true, summary: '5/5 checks passed' }
    };
    const report = generateReport(withCompliance);
    assert.ok(report.includes('COMPLIANT'));
    assert.ok(report.includes('5/5'));
  });
});
