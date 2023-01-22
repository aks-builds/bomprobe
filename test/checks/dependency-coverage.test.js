const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/dependency-coverage');

describe('dependency-coverage check', () => {
  it('passes with good coverage', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }],
      dependencyGraph: { totalEntries: 2, componentsWithDeps: 2, coverage: 1.0 }
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when no dependencies exist', () => {
    const sbom = {
      components: [{ name: 'a' }],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /no dependency/);
  });

  it('reports low coverage', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }],
      dependencyGraph: { totalEntries: 1, componentsWithDeps: 1, coverage: 0.25 }
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /25%/);
  });

  it('skips when no components', () => {
    const sbom = {
      components: [],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
