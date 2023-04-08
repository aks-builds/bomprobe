const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-completeness');

describe('dependency-completeness check', () => {
  it('passes when all refs are known', () => {
    const sbom = {
      components: [{ 'bom-ref': 'a', name: 'a' }, { 'bom-ref': 'b', name: 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags unknown dependency ref', () => {
    const sbom = {
      components: [{ 'bom-ref': 'a', name: 'a' }],
      dependencies: [{ ref: 'a', dependsOn: ['unknown-ref'] }]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles empty dependencies', () => {
    const sbom = { components: [{ 'bom-ref': 'a' }], dependencies: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles missing dependencies key', () => {
    const sbom = { components: [{ 'bom-ref': 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
