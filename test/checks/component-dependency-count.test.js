const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-dependency-count');

describe('component-dependency-count check', () => {
  it('passes within threshold', () => {
    const sbom = { dependencies: [{ ref: 'a', dependsOn: ['b', 'c'] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags excessive dependencies', () => {
    const many = Array.from({ length: 25 }, (_, i) => `dep-${i}`);
    const sbom = { dependencies: [{ ref: 'bloated', dependsOn: many }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('25'));
  });

  it('handles empty dependencies', () => {
    assert.equal(check.run({ dependencies: [] }).length, 0);
  });

  it('handles no dependencies key', () => {
    assert.equal(check.run({}).length, 0);
  });
});
