const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-depth-warning');

describe('dependency-depth-warning check', () => {
  it('passes shallow chains', () => {
    const sbom = { dependencies: [
      { ref: 'a', dependsOn: ['b'] },
      { ref: 'b', dependsOn: [] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags deep chains', () => {
    const deps = [];
    for (let i = 0; i < 15; i++) {
      deps.push({ ref: `pkg-${i}`, dependsOn: i < 14 ? [`pkg-${i + 1}`] : [] });
    }
    const sbom = { dependencies: deps };
    const findings = check.run(sbom);
    assert.ok(findings.length > 0);
    assert.ok(findings[0].message.includes('levels deep'));
  });

  it('handles cycles without crashing', () => {
    const sbom = { dependencies: [
      { ref: 'a', dependsOn: ['b'] },
      { ref: 'b', dependsOn: ['a'] }
    ]};
    check.run(sbom);
  });

  it('handles empty dependencies', () => {
    assert.equal(check.run({ dependencies: [] }).length, 0);
  });
});
