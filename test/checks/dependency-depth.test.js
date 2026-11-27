const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-depth');

describe('dependency-depth check', () => {
  it('passes shallow dependency tree', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on deep dependency tree', () => {
    const components = [];
    const deps = [];
    for (let i = 0; i < 15; i++) {
      components.push({ name: `pkg-${i}` });
      if (i > 0) deps.push({ ref: `pkg-${i - 1}`, dependsOn: [`pkg-${i}`] });
    }
    const sbom = { components, dependencies: deps };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('skips when no dependencies defined', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes exactly at threshold', () => {
    const components = [];
    const deps = [];
    for (let i = 0; i <= 10; i++) {
      components.push({ name: `pkg-${i}` });
      if (i > 0) deps.push({ ref: `pkg-${i - 1}`, dependsOn: [`pkg-${i}`] });
    }
    const sbom = { components, dependencies: deps };
    assert.equal(check.run(sbom).length, 0);
  });
});
