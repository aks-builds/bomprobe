const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatGitHubAnnotations, formatGitLabCodeQuality, formatJUnit } = require('../../src/output/ciReport');

const result = {
  checks: [
    { id: 'check-a', name: 'Check A', findings: [
      { severity: 'error', message: 'Missing name' },
      { severity: 'warning', message: 'No version' }
    ]},
    { id: 'check-b', name: 'Check B', findings: [
      { severity: 'info', message: 'Consider adding description' }
    ]}
  ]
};

describe('ciReport', () => {
  describe('formatGitHubAnnotations', () => {
    it('produces annotation lines', () => {
      const out = formatGitHubAnnotations(result);
      assert.ok(out.includes('::error title=Check A::Missing name'));
      assert.ok(out.includes('::warning title=Check A::No version'));
      assert.ok(out.includes('::notice title=Check B::'));
    });

    it('handles empty checks', () => {
      assert.equal(formatGitHubAnnotations({ checks: [] }), '');
    });
  });

  describe('formatGitLabCodeQuality', () => {
    it('produces valid JSON array', () => {
      const parsed = JSON.parse(formatGitLabCodeQuality(result));
      assert.equal(parsed.length, 3);
      assert.equal(parsed[0].severity, 'critical');
      assert.equal(parsed[1].severity, 'major');
    });

    it('includes fingerprints', () => {
      const parsed = JSON.parse(formatGitLabCodeQuality(result));
      assert.ok(parsed.every(i => i.fingerprint));
    });
  });

  describe('formatJUnit', () => {
    it('produces valid XML structure', () => {
      const xml = formatJUnit(result);
      assert.ok(xml.startsWith('<?xml'));
      assert.ok(xml.includes('<testsuites'));
      assert.ok(xml.includes('</testsuites>'));
    });

    it('counts failures correctly', () => {
      const xml = formatJUnit(result);
      assert.ok(xml.includes('failures="1"'));
    });

    it('escapes XML entities', () => {
      const r = { checks: [{ id: 'x', name: 'X & Y', findings: [{ severity: 'error', message: '<bad>' }] }] };
      const xml = formatJUnit(r);
      assert.ok(xml.includes('&amp;'));
      assert.ok(xml.includes('&lt;bad&gt;'));
    });
  });
});
