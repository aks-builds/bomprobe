const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { extractVulnerabilities, correlateWithQuality, summarizeVulns, formatVulnReport, normalizeSeverity, getMaxSeverity } = require('../../src/vuln/correlator');

describe('extractVulnerabilities', () => {
  it('returns empty for null sbom', () => {
    assert.deepEqual(extractVulnerabilities(null), []);
  });

  it('extracts from component-level vulns', () => {
    const sbom = {
      components: [{
        name: 'lodash', version: '4.17.20',
        vulnerabilities: [{ id: 'CVE-2021-23337', ratings: [{ severity: 'high' }] }]
      }]
    };
    const vulns = extractVulnerabilities(sbom);
    assert.equal(vulns.length, 1);
    assert.equal(vulns[0].id, 'CVE-2021-23337');
    assert.equal(vulns[0].severity, 'high');
  });

  it('extracts from top-level vulnerabilities with affects', () => {
    const sbom = {
      components: [{ 'bom-ref': 'pkg:npm/express@4.17.1', name: 'express', version: '4.17.1' }],
      vulnerabilities: [{
        id: 'CVE-2024-1234',
        ratings: [{ score: 7.5 }],
        affects: [{ ref: 'pkg:npm/express@4.17.1' }]
      }]
    };
    const vulns = extractVulnerabilities(sbom);
    assert.equal(vulns.length, 1);
    assert.equal(vulns[0].component, 'express');
    assert.equal(vulns[0].severity, 'high');
  });

  it('handles unattributed top-level vulns', () => {
    const sbom = { vulnerabilities: [{ id: 'CVE-2024-5678', ratings: [{ severity: 'critical' }] }] };
    const vulns = extractVulnerabilities(sbom);
    assert.equal(vulns.length, 1);
    assert.equal(vulns[0].component, 'unattributed');
  });
});

describe('normalizeSeverity', () => {
  it('returns severity string directly', () => {
    assert.equal(normalizeSeverity([{ severity: 'HIGH' }]), 'high');
  });

  it('maps CVSS score to severity', () => {
    assert.equal(normalizeSeverity([{ score: 9.8 }]), 'critical');
    assert.equal(normalizeSeverity([{ score: 7.5 }]), 'high');
    assert.equal(normalizeSeverity([{ score: 5.0 }]), 'medium');
    assert.equal(normalizeSeverity([{ score: 2.0 }]), 'low');
  });

  it('returns unknown for empty', () => {
    assert.equal(normalizeSeverity([]), 'unknown');
    assert.equal(normalizeSeverity(null), 'unknown');
  });
});

describe('getMaxSeverity', () => {
  it('picks highest', () => {
    assert.equal(getMaxSeverity(['low', 'critical', 'medium']), 'critical');
  });

  it('handles single', () => {
    assert.equal(getMaxSeverity(['medium']), 'medium');
  });
});

describe('correlateWithQuality', () => {
  it('ranks by risk score', () => {
    const vulns = [
      { component: 'a', version: '1.0', severity: 'critical', id: 'CVE-1' },
      { component: 'b', version: '2.0', severity: 'low', id: 'CVE-2' }
    ];
    const corr = correlateWithQuality(vulns, []);
    assert.equal(corr[0].component, 'a@1.0');
    assert.ok(corr[0].riskScore > corr[1].riskScore);
  });

  it('boosts risk for quality issues', () => {
    const vulns = [{ component: 'x', version: '1.0', severity: 'low', id: 'CVE-1' }];
    const noQuality = correlateWithQuality(vulns, []);
    const withQuality = correlateWithQuality(vulns, [
      { component: 'x@1.0', severity: 'warning', message: 'missing hash' }
    ]);
    assert.ok(withQuality[0].riskScore > noQuality[0].riskScore);
  });
});

describe('summarizeVulns', () => {
  it('counts by severity', () => {
    const vulns = [
      { id: 'CVE-1', severity: 'high', component: 'a', source: 'NVD' },
      { id: 'CVE-2', severity: 'high', component: 'b', source: 'NVD' },
      { id: 'CVE-3', severity: 'low', component: 'a', source: 'OSV' }
    ];
    const s = summarizeVulns(vulns);
    assert.equal(s.total, 3);
    assert.equal(s.unique, 3);
    assert.equal(s.bySeverity.high, 2);
    assert.equal(s.affectedComponents, 2);
  });
});

describe('formatVulnReport', () => {
  it('produces readable output', () => {
    const vulns = [{ id: 'CVE-1', severity: 'high', component: 'x', source: 'NVD' }];
    const corr = [{ component: 'x@1.0', vulnCount: 1, maxSeverity: 'high', qualityIssues: 0, riskScore: 7 }];
    const out = formatVulnReport(vulns, corr);
    assert.ok(out.includes('Vulnerability Correlation'));
    assert.ok(out.includes('High: 1'));
  });
});
