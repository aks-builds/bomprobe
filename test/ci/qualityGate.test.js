const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runQualityGate, formatGateResult } = require('../../src/ci/qualityGate');

describe('quality gate', () => {
  const result = {
    score: { overall: 85 },
    checks: [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [] },
      { id: 'component-supplier', findings: [] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] },
      { id: 'unique-purls', findings: [] }
    ]
  };

  it('passes with no gates configured', () => {
    const gate = runQualityGate(result);
    assert.equal(gate.passed, true);
    assert.equal(gate.gates.length, 0);
  });

  it('passes NTIA compliance gate', () => {
    const gate = runQualityGate(result, { compliance: 'ntia' });
    assert.equal(gate.passed, true);
    assert.equal(gate.gates.length, 1);
    assert.ok(gate.gates[0].details.includes('Compliant'));
  });

  it('fails compliance gate with missing checks', () => {
    const badResult = { score: 30, checks: [] };
    const gate = runQualityGate(badResult, { compliance: 'ntia' });
    assert.equal(gate.passed, false);
  });

  it('passes policy gate', () => {
    const gate = runQualityGate(result, { policy: { minScore: 80 } });
    assert.equal(gate.passed, true);
  });

  it('fails policy gate below threshold', () => {
    const gate = runQualityGate(result, { policy: { minScore: 90 } });
    assert.equal(gate.passed, false);
  });

  it('formats passed result', () => {
    const gate = runQualityGate(result, { compliance: 'ntia' });
    const output = formatGateResult(gate);
    assert.ok(output.includes('PASSED'));
    assert.ok(output.includes('[PASS]'));
  });

  it('formats failed result', () => {
    const gate = runQualityGate({ score: 30, checks: [] }, { compliance: 'ntia' });
    const output = formatGateResult(gate);
    assert.ok(output.includes('FAILED'));
    assert.ok(output.includes('[FAIL]'));
  });
});
