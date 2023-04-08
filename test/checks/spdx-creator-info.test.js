const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-creator-info');

describe('spdx-creator-info check', () => {
  it('skips non-SPDX', () => {
    const sbom = { format: 'cyclonedx', metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing creators', () => {
    const sbom = { format: 'spdx', metadata: { creators: [] }, components: [] };
    assert.equal(check.run(sbom).length, 1);
    assert.equal(check.run(sbom)[0].severity, 'warning');
  });

  it('flags missing tool creator', () => {
    const sbom = { format: 'spdx', metadata: { creators: ['Organization: Acme'] }, components: [] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('tool')));
  });

  it('passes with both tool and org', () => {
    const sbom = {
      format: 'spdx',
      metadata: { creators: ['Tool: bomprobe-1.0', 'Organization: Acme'] },
      components: []
    };
    assert.equal(check.run(sbom).length, 0);
  });
});
