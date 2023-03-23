const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/duplicate-components');

describe('duplicate-components check', () => {
  it('passes when all components are unique', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0' },
        { name: 'b', version: '2.0' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports duplicates', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0' },
        { name: 'a', version: '1.0' },
        { name: 'b', version: '2.0' }
      ]
    };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('2 times'));
  });

  it('allows same name with different versions', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0' },
        { name: 'a', version: '2.0' }
      ]
    };
    assert.equal(check.run(sbom).length, 0);
  });

  it('handles empty components', () => {
    assert.equal(check.run({ components: [] }).length, 0);
  });
});
