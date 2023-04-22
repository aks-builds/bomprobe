const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-cycle');

describe('dependency-cycle check', () => {
  it('passes acyclic dependencies', () => {
    const sbom = { dependencies: [
      { ref: 'a', dependsOn: ['b'] },
      { ref: 'b', dependsOn: ['c'] },
      { ref: 'c', dependsOn: [] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags circular dependency', () => {
    const sbom = { dependencies: [
      { ref: 'a', dependsOn: ['b'] },
      { ref: 'b', dependsOn: ['a'] }
    ]};
    const findings = check.run(sbom);
    assert.ok(findings.length > 0);
    assert.ok(findings[0].message.includes('Circular'));
  });

  it('handles empty dependencies', () => {
    assert.equal(check.run({ dependencies: [] }).length, 0);
  });

  it('handles no dependencies key', () => {
    assert.equal(check.run({}).length, 0);
  });
});
