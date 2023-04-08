const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getProfile, listProfiles, evaluateCompliance } = require('../../src/compliance/profiles');

describe('compliance profiles', () => {
  it('gets NTIA profile', () => {
    const p = getProfile('ntia');
    assert.ok(p);
    assert.equal(p.name, 'NTIA Minimum Elements');
  });

  it('returns null for unknown profile', () => {
    assert.equal(getProfile('nonexistent'), null);
  });

  it('lists all profiles', () => {
    const profiles = listProfiles();
    assert.ok(profiles.length >= 3);
    assert.ok(profiles.some(p => p.id === 'ntia'));
    assert.ok(profiles.some(p => p.id === 'bsi'));
    assert.ok(profiles.some(p => p.id === 'cra'));
  });

  it('evaluates compliance - all pass', () => {
    const results = [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [] },
      { id: 'component-supplier', findings: [] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] },
      { id: 'unique-purls', findings: [] }
    ];
    const evaluation = evaluateCompliance(results, 'ntia');
    assert.equal(evaluation.compliant, true);
    assert.equal(evaluation.score, 100);
  });

  it('evaluates compliance - some fail', () => {
    const results = [
      { id: 'component-name', findings: [{ severity: 'error' }] },
      { id: 'component-version', findings: [] },
      { id: 'component-supplier', findings: [] },
      { id: 'metadata-author', findings: [] },
      { id: 'metadata-timestamp', findings: [] },
      { id: 'dependency-coverage', findings: [] },
      { id: 'unique-purls', findings: [] }
    ];
    const evaluation = evaluateCompliance(results, 'ntia');
    assert.equal(evaluation.compliant, false);
    assert.equal(evaluation.failed.length, 1);
  });

  it('reports error for unknown profile', () => {
    const evaluation = evaluateCompliance([], 'unknown');
    assert.ok(evaluation.error);
  });
});
