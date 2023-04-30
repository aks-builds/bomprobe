const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependencyPhantom');

describe('dependency-phantom', () => {
  it('passes when all deps exist in components', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on phantom dependency', () => {
    const sbom = {
      components: [{ name: 'a' }],
      dependencies: [{ ref: 'a', dependsOn: ['ghost'] }]
    };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('ghost')));
  });

  it('handles bom-ref matching', () => {
    const sbom = {
      components: [{ name: 'a', 'bom-ref': 'ref-a' }],
      dependencies: [{ ref: 'x', dependsOn: ['ref-a'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles purl matching', () => {
    const sbom = {
      components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }],
      dependencies: [{ ref: 'x', dependsOn: ['pkg:npm/a@1.0'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
