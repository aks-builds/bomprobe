const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependencyTransitiveDepth');

describe('dependency-transitive-depth', () => {
  it('passes shallow dependency trees', () => {
    const sbom = {
      components: [],
      dependencies: [
        { ref: 'a', dependsOn: ['b'] },
        { ref: 'b', dependsOn: [] }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on deep dependency chains', () => {
    const deps = [];
    for (let i = 0; i < 12; i++) {
      deps.push({ ref: `pkg-${i}`, dependsOn: i < 11 ? [`pkg-${i + 1}`] : [] });
    }
    const sbom = { components: [], dependencies: deps };
    const findings = check.run(sbom);
    assert.ok(findings.length > 0);
    assert.ok(findings[0].message.includes('depth'));
  });

  it('handles circular dependencies without infinite loop', () => {
    const sbom = {
      components: [],
      dependencies: [
        { ref: 'a', dependsOn: ['b'] },
        { ref: 'b', dependsOn: ['a'] }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles missing dependencies', () => {
    assert.equal(check.run({ components: [] }).length, 0);
  });
});
