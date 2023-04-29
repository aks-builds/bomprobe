const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { findSbomFiles, batchAudit, formatBatchSummary } = require('../../src/cli/batchScanner');

describe('batch scanner', () => {
  it('finds SBOM files in test fixtures', () => {
    const files = findSbomFiles('test/fixtures', 1);
    assert.ok(files.length > 0, 'should find at least one fixture');
  });

  it('runs batch audit across files', () => {
    const mockAudit = () => ({
      score: { overall: 75 },
      checks: [{ findings: [{ severity: 'warning', message: 'test' }] }]
    });
    const results = batchAudit(['a.json', 'b.json'], mockAudit);
    assert.equal(results.length, 2);
    assert.equal(results[0].file, 'a.json');
  });

  it('formats batch summary with pass/fail counts', () => {
    const results = [
      {
        file: '/tmp/good.json',
        result: { score: { overall: 85 }, checks: [{ findings: [] }] }
      },
      {
        file: '/tmp/bad.json',
        result: { score: { overall: 30 }, checks: [{ findings: [{ severity: 'error', message: 'x' }] }] }
      }
    ];
    const summary = formatBatchSummary(results);
    assert.ok(summary.includes('2 SBOM files'));
    assert.ok(summary.includes('1 passed, 1 failed'));
  });

  it('handles errors in batch results', () => {
    const results = [
      { file: 'broken.json', result: { error: 'parse failed' } }
    ];
    const summary = formatBatchSummary(results);
    assert.ok(summary.includes('FAIL'));
    assert.ok(summary.includes('parse failed'));
  });
});
