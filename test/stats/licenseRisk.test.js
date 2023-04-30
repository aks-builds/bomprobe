const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeLicenseRisk, classifyLicense, formatLicenseRisk, detectConflicts } = require('../../src/stats/licenseRisk');

describe('classifyLicense', () => {
  it('classifies MIT as permissive', () => {
    assert.equal(classifyLicense('MIT'), 'permissive');
  });

  it('classifies AGPL-3.0-only as high-risk', () => {
    assert.equal(classifyLicense('AGPL-3.0-only'), 'high-risk');
  });

  it('classifies GPL-2.0-only as copyleft', () => {
    assert.equal(classifyLicense('GPL-2.0-only'), 'copyleft');
  });

  it('classifies LGPL-3.0-only as weak-copyleft', () => {
    assert.equal(classifyLicense('LGPL-3.0-only'), 'weak-copyleft');
  });

  it('returns unknown for null', () => {
    assert.equal(classifyLicense(null), 'unknown');
  });

  it('returns unclassified for unknown license', () => {
    assert.equal(classifyLicense('ACME-PROPRIETARY'), 'unclassified');
  });
});

describe('analyzeLicenseRisk', () => {
  it('flags AGPL components as high-risk', () => {
    const sbom = { components: [
      { name: 'risky', licenses: [{ license: { id: 'AGPL-3.0-only' } }] }
    ]};
    const result = analyzeLicenseRisk(sbom);
    assert.equal(result.summary.highRisk, 1);
    assert.ok(result.risks.some(r => r.severity === 'error'));
  });

  it('flags GPL components as copyleft warning', () => {
    const sbom = { components: [
      { name: 'gpl-lib', licenses: [{ license: { id: 'GPL-2.0-only' } }] }
    ]};
    const result = analyzeLicenseRisk(sbom);
    assert.ok(result.risks.some(r => r.severity === 'warning'));
  });

  it('counts unlicensed components', () => {
    const sbom = { components: [{ name: 'no-lic' }] };
    const result = analyzeLicenseRisk(sbom);
    assert.equal(result.summary.unlicensed, 1);
  });

  it('permissive-only SBOM has no risks', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'Apache-2.0' } }] }
    ]};
    const result = analyzeLicenseRisk(sbom);
    assert.equal(result.risks.length, 0);
  });
});

describe('detectConflicts', () => {
  it('detects GPL-2.0-only vs GPL-3.0 conflict', () => {
    const components = [
      { name: 'old', licenses: [{ license: { id: 'GPL-2.0-only' } }] },
      { name: 'new', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
    ];
    const conflicts = detectConflicts(components);
    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0].type, 'gpl-version-conflict');
  });

  it('no conflicts when all MIT', () => {
    const components = [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'MIT' } }] }
    ];
    assert.equal(detectConflicts(components).length, 0);
  });
});

describe('formatLicenseRisk', () => {
  it('formats readable output', () => {
    const result = analyzeLicenseRisk({ components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'AGPL-3.0-only' } }] }
    ]});
    const out = formatLicenseRisk(result);
    assert.ok(out.includes('High-risk'));
    assert.ok(out.includes('AGPL'));
  });
});
