const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-license-tree');

describe('dependency-license-tree check', () => {
  it('passes when all deps have licenses', () => {
    const sbom = {
      components: [
        { name: 'a', purl: 'a', licenses: [{ license: { id: 'MIT' } }] },
        { name: 'b', purl: 'b', licenses: [{ license: { id: 'ISC' } }] }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags dep without license', () => {
    const sbom = {
      components: [
        { name: 'a', purl: 'a', licenses: [{ license: { id: 'MIT' } }] },
        { name: 'b', purl: 'b' }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles empty deps', () => {
    assert.equal(check.run({ components: [], dependencies: [] }).length, 0);
  });
});
