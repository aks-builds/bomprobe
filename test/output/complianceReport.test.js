const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatComplianceText, formatComplianceJson, formatComplianceMarkdown } = require('../../src/output/complianceReport');

const profiles = [
  {
    profile: 'NTIA', score: 100, met: 7, total: 7,
    findings: [{ requirement: 'Supplier name', met: true }, { requirement: 'Component name', met: true }]
  },
  {
    profile: 'EU CRA', score: 75, met: 6, total: 8,
    findings: [{ requirement: 'Vulnerability disclosure', met: false }, { requirement: 'Update mechanism', met: true }]
  }
];

describe('compliance report', () => {
  describe('text format', () => {
    it('shows pass/fail status', () => {
      const text = formatComplianceText(profiles);
      assert.ok(text.includes('NTIA: PASS'));
      assert.ok(text.includes('EU CRA: FAIL'));
    });

    it('shows requirement counts', () => {
      const text = formatComplianceText(profiles);
      assert.ok(text.includes('7/7'));
      assert.ok(text.includes('6/8'));
    });
  });

  describe('JSON format', () => {
    it('produces valid JSON', () => {
      const parsed = JSON.parse(formatComplianceJson(profiles));
      assert.equal(parsed.profiles.length, 2);
      assert.equal(parsed.profiles[0].status, 'pass');
      assert.equal(parsed.profiles[1].status, 'fail');
    });

    it('includes timestamp', () => {
      const parsed = JSON.parse(formatComplianceJson(profiles));
      assert.ok(parsed.timestamp);
    });
  });

  describe('markdown format', () => {
    it('uses checkbox syntax', () => {
      const md = formatComplianceMarkdown(profiles);
      assert.ok(md.includes('[x] Supplier name'));
      assert.ok(md.includes('[ ] Vulnerability disclosure'));
    });

    it('includes headers', () => {
      const md = formatComplianceMarkdown(profiles);
      assert.ok(md.includes('## NTIA'));
      assert.ok(md.includes('## EU CRA'));
    });
  });
});
