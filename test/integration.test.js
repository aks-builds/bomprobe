const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { audit } = require('../src');

const fixtures = path.join(__dirname, 'fixtures');

describe('integration: audit pipeline', () => {
  it('scores a minimal CycloneDX file', () => {
    const result = audit(path.join(fixtures, 'minimal-cdx.json'));
    assert.ok(result.score);
    assert.ok(result.score.overall >= 0 && result.score.overall <= 10);
    assert.ok(result.checks.length > 0);
  });

  it('scores a minimal SPDX file', () => {
    const result = audit(path.join(fixtures, 'minimal-spdx.json'));
    assert.ok(result.score);
    assert.equal(result.format, 'spdx');
  });

  it('gives high score to perfect CycloneDX', () => {
    const result = audit(path.join(fixtures, 'perfect-cdx.json'));
    assert.ok(result.score.overall >= 9);
  });

  it('gives high score to perfect SPDX', () => {
    const result = audit(path.join(fixtures, 'perfect-spdx.json'));
    assert.ok(result.score.overall >= 8);
  });

  it('reports many findings for empty CycloneDX', () => {
    const result = audit(path.join(fixtures, 'empty-cdx.json'));
    const totalFindings = result.checks.reduce((sum, c) => sum + c.findings.length, 0);
    assert.ok(totalFindings > 0);
  });

  it('reports many findings for empty SPDX', () => {
    const result = audit(path.join(fixtures, 'empty-spdx.json'));
    const totalFindings = result.checks.reduce((sum, c) => sum + c.findings.length, 0);
    assert.ok(totalFindings > 0);
  });

  it('runs NTIA profile on CycloneDX', () => {
    const result = audit(path.join(fixtures, 'perfect-cdx.json'), { profile: 'ntia' });
    assert.ok(result.compliance);
    assert.equal(result.compliance.compliant, true);
  });

  it('runs NTIA profile on SPDX', () => {
    const result = audit(path.join(fixtures, 'perfect-spdx.json'), { profile: 'ntia' });
    assert.ok(result.compliance);
    assert.equal(result.compliance.compliant, true);
  });

  it('returns error for nonexistent file', () => {
    const result = audit('/no/such/file.json');
    assert.ok(result.error);
  });
});
