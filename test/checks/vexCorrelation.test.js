const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { correlateVex, formatVexReport } = require('../../src/checks/vexCorrelation');

describe('VEX correlation', () => {
  const sbom = {
    components: [
      { name: 'lodash', version: '4.17.20', purl: 'pkg:npm/lodash@4.17.20' },
      { name: 'express', version: '4.18.0', purl: 'pkg:npm/express@4.18.0' },
      { name: 'safe-lib', version: '1.0.0', purl: 'pkg:npm/safe-lib@1.0.0' }
    ]
  };

  const vex = {
    statements: [
      {
        vulnerability: { id: 'CVE-2021-23337', name: 'CVE-2021-23337' },
        products: [{ purl: 'pkg:npm/lodash@4.17.20' }],
        status: 'affected',
        impact_statement: 'Prototype pollution in lodash'
      },
      {
        vulnerability: { id: 'CVE-2024-1234', name: 'CVE-2024-1234' },
        products: [{ purl: 'pkg:npm/express@4.18.0' }],
        status: 'not_affected',
        justification: 'vulnerable_code_not_in_execute_path'
      }
    ]
  };

  it('correlates VEX statements with SBOM components', () => {
    const result = correlateVex(sbom, vex);
    assert.equal(result.totalComponents, 3);
    assert.equal(result.totalStatements, 2);
    assert.equal(result.affected.length, 1);
    assert.equal(result.notAffected.length, 1);
    assert.equal(result.affected[0].component, 'lodash');
  });

  it('formats VEX report', () => {
    const result = correlateVex(sbom, vex);
    const report = formatVexReport(result);
    assert.ok(report.includes('AFFECTED'));
    assert.ok(report.includes('CVE-2021-23337'));
    assert.ok(report.includes('NOT AFFECTED'));
    assert.ok(report.includes('vulnerable_code_not_in_execute_path'));
  });

  it('handles empty VEX document', () => {
    const result = correlateVex(sbom, { statements: [] });
    assert.equal(result.all.length, 0);
    assert.equal(result.affected.length, 0);
  });

  it('handles components with no purl match', () => {
    const result = correlateVex(sbom, {
      statements: [{ vulnerability: { id: 'CVE-X' }, products: [{ purl: 'pkg:npm/unknown@1' }], status: 'affected' }]
    });
    assert.equal(result.affected.length, 0);
  });
});
