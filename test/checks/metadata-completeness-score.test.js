const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-completeness-score');

describe('metadata-completeness-score check', () => {
  it('passes complete metadata', () => {
    const sbom = { metadata: {
      timestamp: '2023-04-29',
      tools: [{ name: 'bomprobe' }],
      authors: [{ name: 'dev' }],
      component: { name: 'app' }
    }};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing metadata section', () => {
    const sbom = {};
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'error');
  });

  it('reports each missing field', () => {
    const sbom = { metadata: { timestamp: '2023-04-29' } };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('tools')));
    assert.ok(findings.some(f => f.message.includes('authors')));
  });

  it('warns on low completeness', () => {
    const sbom = { metadata: {} };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.severity === 'warning' && f.message.includes('low')));
  });

  it('accepts manufacture as author alternative', () => {
    const sbom = { metadata: {
      timestamp: '2023-04-29',
      tools: [{ name: 'x' }],
      manufacture: { name: 'org' },
      component: { name: 'app' }
    }};
    assert.equal(check.run(sbom).length, 0);
  });
});
