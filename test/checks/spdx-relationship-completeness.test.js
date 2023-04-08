const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-relationship-completeness');

describe('spdx-relationship-completeness check', () => {
  it('skips non-SPDX', () => {
    assert.equal(check.run({ format: 'cyclonedx', components: [] }).length, 0);
  });

  it('passes with DESCRIBES relationship', () => {
    const sbom = {
      format: 'spdx',
      components: [{ spdxId: 'SPDXRef-Pkg' }],
      spdxRelationships: [
        { element: 'SPDXRef-DOCUMENT', related: 'SPDXRef-Pkg', type: 'DESCRIBES' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing DESCRIBES', () => {
    const sbom = {
      format: 'spdx',
      components: [],
      spdxRelationships: [
        { element: 'SPDXRef-A', related: 'SPDXRef-B', type: 'DEPENDS_ON' }
      ]
    };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags orphaned packages', () => {
    const sbom = {
      format: 'spdx',
      components: [{ spdxId: 'SPDXRef-Orphan' }],
      spdxRelationships: [
        { element: 'SPDXRef-DOCUMENT', related: 'SPDXRef-Other', type: 'DESCRIBES' }
      ]
    };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('Orphan')));
  });
});
