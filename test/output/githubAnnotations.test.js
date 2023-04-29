const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatAnnotations, countAnnotations } = require('../../src/output/githubAnnotations');

describe('github annotations', () => {
  it('formats error findings', () => {
    const results = [{ id: 'comp-name', name: 'CN', findings: [
      { severity: 'error', message: 'Missing name' }
    ]}];
    const out = formatAnnotations(results);
    assert.ok(out.includes('::error'));
    assert.ok(out.includes('Missing name'));
  });

  it('formats warning findings', () => {
    const results = [{ id: 'comp-ver', name: 'CV', findings: [
      { severity: 'warning', message: 'Loose version' }
    ]}];
    assert.ok(formatAnnotations(results).includes('::warning'));
  });

  it('formats info as notice', () => {
    const results = [{ id: 'x', name: 'X', findings: [
      { severity: 'info', message: 'Note' }
    ]}];
    assert.ok(formatAnnotations(results).includes('::notice'));
  });

  it('counts annotations by severity', () => {
    const results = [
      { id: 'a', findings: [{ severity: 'error' }, { severity: 'warning' }] },
      { id: 'b', findings: [{ severity: 'info' }] }
    ];
    const counts = countAnnotations(results);
    assert.equal(counts.errors, 1);
    assert.equal(counts.warnings, 1);
    assert.equal(counts.notices, 1);
    assert.equal(counts.total, 3);
  });

  it('returns empty string for no findings', () => {
    assert.equal(formatAnnotations([{ id: 'a', findings: [] }]), '');
  });
});
