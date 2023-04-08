const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/composition-completeness');

describe('composition-completeness check', () => {
  it('flags missing compositions', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('passes complete composition', () => {
    const sbom = { components: [], compositions: [{ aggregate: 'complete', assemblies: [] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on missing aggregate', () => {
    const sbom = { components: [], compositions: [{ assemblies: [] }] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning'));
  });

  it('warns on unknown aggregate', () => {
    const sbom = { components: [], compositions: [{ aggregate: 'invented' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('Unknown')));
  });

  it('info on incomplete composition', () => {
    const sbom = { components: [], compositions: [{ aggregate: 'incomplete' }] };
    assert.ok(check.run(sbom).some(f => f.severity === 'info'));
  });
});
