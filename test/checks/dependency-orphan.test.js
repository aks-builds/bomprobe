const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-orphan');

describe('dependency-orphan check', () => {
  it('passes when all refs match components', () => {
    const sbom = {
      components: [{ name: 'a', 'bom-ref': 'a' }, { name: 'b', 'bom-ref': 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags orphan dependency ref', () => {
    const sbom = {
      components: [{ name: 'a', 'bom-ref': 'a' }],
      dependencies: [{ ref: 'missing', dependsOn: [] }]
    };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('missing'));
  });

  it('flags orphan dependency target', () => {
    const sbom = {
      components: [{ name: 'a', 'bom-ref': 'a' }],
      dependencies: [{ ref: 'a', dependsOn: ['ghost'] }]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles empty deps', () => {
    assert.equal(check.run({ components: [], dependencies: [] }).length, 0);
  });

  it('matches by purl', () => {
    const sbom = {
      components: [{ name: 'a', purl: 'pkg:npm/a@1.0' }],
      dependencies: [{ ref: 'pkg:npm/a@1.0', dependsOn: [] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
