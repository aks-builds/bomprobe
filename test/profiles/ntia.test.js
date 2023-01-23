const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../../src/profiles/ntia');

describe('NTIA profile', () => {
  it('reports compliant when all required checks pass', () => {
    const checkResults = [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [] },
      { id: 'component-supplier', findings: [] },
      { id: 'component-purl', findings: [] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] }
    ];
    const result = evaluate(checkResults);
    assert.equal(result.compliant, true);
    assert.equal(result.passed.length, 7);
    assert.equal(result.failed.length, 0);
  });

  it('reports non-compliant when checks have findings', () => {
    const checkResults = [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [{ message: 'missing version' }] },
      { id: 'component-supplier', findings: [] },
      { id: 'component-purl', findings: [{ message: 'missing purl' }] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] }
    ];
    const result = evaluate(checkResults);
    assert.equal(result.compliant, false);
    assert.equal(result.passed.length, 5);
    assert.equal(result.failed.length, 2);
  });

  it('reports missing checks as failures', () => {
    const result = evaluate([]);
    assert.equal(result.compliant, false);
    assert.equal(result.failed.length, 7);
  });

  it('includes summary string', () => {
    const checkResults = [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [] },
      { id: 'component-supplier', findings: [] },
      { id: 'component-purl', findings: [] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] }
    ];
    const result = evaluate(checkResults);
    assert.equal(result.summary, '7/7 checks passed');
  });
});
