const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-license-conflict');

describe('dependency-license-conflict check', () => {
  it('passes with all permissive', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'Apache-2.0' } }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags mixed copyleft and permissive', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.length >= 1);
    assert.ok(findings[0].message.includes('Mixed copyleft'));
  });

  it('flags AGPL dependencies', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'risky-lib', licenses: [{ license: { id: 'AGPL-3.0-only' } }] }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('AGPL')));
  });

  it('passes with no licenses', () => {
    const sbom = { components: [{ name: 'a' }, { name: 'b' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
