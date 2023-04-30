const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluatePolicy, formatPolicyResult, getPreset, countBySeverity, extractLicenseIds } = require('../../src/policy/engine');

describe('evaluatePolicy', () => {
  it('passes with no policy', () => {
    const result = evaluatePolicy(null, {});
    assert.equal(result.pass, true);
  });

  it('fails on minScore violation', () => {
    const result = evaluatePolicy({ minScore: 80 }, { score: 60 });
    assert.equal(result.pass, false);
    assert.ok(result.violations.some(v => v.rule === 'minScore'));
  });

  it('passes when score meets minimum', () => {
    const result = evaluatePolicy({ minScore: 70 }, { score: 85 });
    assert.equal(result.pass, true);
  });

  it('fails on maxFindings violation', () => {
    const result = evaluatePolicy(
      { maxFindings: { error: 2 } },
      { findings: [
        { severity: 'error' }, { severity: 'error' }, { severity: 'error' }
      ]}
    );
    assert.equal(result.pass, false);
    assert.ok(result.violations.some(v => v.severity === 'error'));
  });

  it('fails on required checks', () => {
    const result = evaluatePolicy(
      { requiredChecks: ['component-license', 'component-version'] },
      { checks: [{ id: 'component-license', pass: true }, { id: 'component-version', pass: false }] }
    );
    assert.equal(result.pass, false);
    assert.ok(result.violations.some(v => v.checkId === 'component-version'));
  });

  it('detects banned licenses', () => {
    const result = evaluatePolicy(
      { bannedLicenses: ['GPL-3.0-only'] },
      { components: [{ name: 'evil-lib', version: '1.0', licenses: [{ license: { id: 'GPL-3.0-only' } }] }] }
    );
    assert.equal(result.pass, false);
    assert.ok(result.violations.some(v => v.rule === 'bannedLicenses'));
  });

  it('fails on maxAge', () => {
    const result = evaluatePolicy(
      { maxAge: 365 },
      { ageResults: [{ name: 'old', version: '1.0', ageInDays: 500 }] }
    );
    assert.equal(result.pass, false);
  });

  it('fails on minFieldCoverage', () => {
    const result = evaluatePolicy(
      { minFieldCoverage: 80 },
      { fieldCoverage: 55 }
    );
    assert.equal(result.pass, false);
  });

  it('passes when all rules met', () => {
    const result = evaluatePolicy(
      { minScore: 70, maxFindings: { error: 5 }, minFieldCoverage: 50 },
      { score: 85, findings: [{ severity: 'warning' }], fieldCoverage: 60 }
    );
    assert.equal(result.pass, true);
  });
});

describe('countBySeverity', () => {
  it('counts correctly', () => {
    const c = countBySeverity([{ severity: 'error' }, { severity: 'error' }, { severity: 'warning' }]);
    assert.equal(c.error, 2);
    assert.equal(c.warning, 1);
  });
});

describe('extractLicenseIds', () => {
  it('extracts from license objects', () => {
    const comp = { licenses: [{ license: { id: 'MIT' } }, { license: { name: 'ISC' } }] };
    const ids = extractLicenseIds(comp);
    assert.ok(ids.includes('MIT'));
    assert.ok(ids.includes('ISC'));
  });

  it('extracts expressions', () => {
    const comp = { licenses: [{ expression: 'MIT OR Apache-2.0' }] };
    assert.ok(extractLicenseIds(comp).includes('MIT OR Apache-2.0'));
  });
});

describe('getPreset', () => {
  it('returns strict preset', () => {
    const p = getPreset('strict');
    assert.equal(p.minScore, 80);
  });

  it('returns null for unknown', () => {
    assert.equal(getPreset('nonexistent'), null);
  });
});

describe('formatPolicyResult', () => {
  it('formats passing result', () => {
    const out = formatPolicyResult({ policyName: 'test', pass: true, violations: [] });
    assert.ok(out.includes('PASS'));
  });

  it('formats failing result with violations', () => {
    const out = formatPolicyResult({
      policyName: 'strict',
      pass: false,
      violations: [{ rule: 'minScore', message: 'Score 50 is below minimum 80' }]
    });
    assert.ok(out.includes('FAIL'));
    assert.ok(out.includes('minScore'));
  });
});
