const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-scope-mismatch');

describe('dependency-scope-mismatch check', () => {
  it('passes when scopes are consistent', () => {
    const sbom = {
      components: [
        { name: 'a', 'bom-ref': 'a', scope: 'required' },
        { name: 'b', 'bom-ref': 'b', scope: 'required' }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags required child of optional parent', () => {
    const sbom = {
      components: [
        { name: 'opt', 'bom-ref': 'opt', scope: 'optional' },
        { name: 'req', 'bom-ref': 'req', scope: 'required' }
      ],
      dependencies: [{ ref: 'opt', dependsOn: ['req'] }]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles empty dependencies', () => {
    const sbom = { components: [{ name: 'a' }], dependencies: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles missing scope', () => {
    const sbom = {
      components: [{ name: 'a', 'bom-ref': 'a' }],
      dependencies: [{ ref: 'a', dependsOn: [] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
