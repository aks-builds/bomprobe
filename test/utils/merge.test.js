const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mergeResults } = require('../../src/utils/merge');

describe('result merging', () => {
  it('returns null for empty input', () => {
    assert.equal(mergeResults([]), null);
  });

  it('returns single result as-is', () => {
    const r = { file: 'a.json', format: 'cdx', componentCount: 5, score: { overall: 7, components: { average: 6 }, metadata: 5, dependencyCoverage: 4 }, checks: [] };
    assert.equal(mergeResults([r]).file, 'a.json');
  });

  it('merges component counts', () => {
    const r1 = { file: 'a', format: 'cdx', componentCount: 5, score: { overall: 6, components: { average: 6 }, metadata: 6, dependencyCoverage: 6 }, checks: [] };
    const r2 = { file: 'b', format: 'spdx', componentCount: 10, score: { overall: 8, components: { average: 8 }, metadata: 8, dependencyCoverage: 8 }, checks: [] };
    const merged = mergeResults([r1, r2]);
    assert.equal(merged.componentCount, 15);
  });

  it('averages scores', () => {
    const r1 = { file: 'a', format: 'cdx', componentCount: 1, score: { overall: 6, components: { average: 6 }, metadata: 6, dependencyCoverage: 6 }, checks: [] };
    const r2 = { file: 'b', format: 'cdx', componentCount: 1, score: { overall: 8, components: { average: 8 }, metadata: 8, dependencyCoverage: 8 }, checks: [] };
    const merged = mergeResults([r1, r2]);
    assert.equal(merged.score.overall, 7);
  });

  it('merges check findings', () => {
    const r1 = { file: 'a', format: 'cdx', componentCount: 1, score: { overall: 5, components: { average: 5 }, metadata: 5, dependencyCoverage: 5 }, checks: [{ id: 'x', findings: [{ severity: 'error' }] }] };
    const r2 = { file: 'b', format: 'cdx', componentCount: 1, score: { overall: 5, components: { average: 5 }, metadata: 5, dependencyCoverage: 5 }, checks: [{ id: 'x', findings: [{ severity: 'warning' }] }] };
    const merged = mergeResults([r1, r2]);
    assert.equal(merged.checks[0].findings.length, 2);
  });
});
