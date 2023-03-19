const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-dependencies');

describe('component-dependencies check', () => {
  it('passes when dependency graph has good coverage', () => {
    const sbom = {
      components: [{ name: 'a' }],
      dependencyGraph: { totalEntries: 1, componentsWithDeps: 1, coverage: 1 }
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns when graph is empty but components exist', () => {
    const sbom = {
      components: [{ name: 'a' }],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });

  it('reports info when coverage is low', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
      dependencyGraph: { totalEntries: 1, componentsWithDeps: 1, coverage: 0.33 }
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('passes with no components', () => {
    const sbom = {
      components: [],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
