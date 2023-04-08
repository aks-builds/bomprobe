const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeVulnerabilities, highSeverityCount } = require('../../src/utils/vulnAnalysis');

describe('vulnerability analysis', () => {
  it('handles empty list', () => {
    const result = analyzeVulnerabilities([]);
    assert.equal(result.total, 0);
  });

  it('counts by severity', () => {
    const vulns = [
      { ratings: [{ severity: 'critical' }], source: { name: 'NVD' } },
      { ratings: [{ severity: 'high' }], source: { name: 'NVD' } },
      { ratings: [{ severity: 'low' }], source: { name: 'GHSA' } }
    ];
    const result = analyzeVulnerabilities(vulns);
    assert.equal(result.total, 3);
    assert.equal(result.bySeverity.critical, 1);
    assert.equal(result.bySeverity.high, 1);
    assert.equal(result.withRating, 3);
  });

  it('counts by source', () => {
    const vulns = [
      { ratings: [], source: { name: 'NVD' } },
      { ratings: [], source: { name: 'NVD' } }
    ];
    const result = analyzeVulnerabilities(vulns);
    assert.equal(result.bySource.NVD, 2);
  });

  it('counts high severity vulns', () => {
    const vulns = [
      { ratings: [{ severity: 'critical' }] },
      { ratings: [{ severity: 'low' }] },
      { ratings: [{ severity: 'high' }] }
    ];
    assert.equal(highSeverityCount(vulns), 2);
  });

  it('returns 0 for null', () => {
    assert.equal(highSeverityCount(null), 0);
  });
});
