const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildJunit, formatJunit, esc } = require('../../src/report/junitBuilder');

describe('buildJunit', () => {
  it('counts passing checks', () => {
    const result = buildJunit({ checks: [{ id: 'a', findings: [] }, { id: 'b', findings: [] }] });
    assert.equal(result.tests, 2);
    assert.equal(result.failures, 0);
    assert.equal(result.errors, 0);
  });

  it('counts failures and errors', () => {
    const result = buildJunit({
      checks: [{
        id: 'x', severity: 'error',
        findings: [{ message: 'bad', severity: 'error' }]
      }, {
        id: 'y', severity: 'warning',
        findings: [{ message: 'meh', severity: 'warning' }]
      }]
    });
    assert.equal(result.errors, 1);
    assert.equal(result.failures, 1);
  });
});

describe('formatJunit', () => {
  it('produces valid XML', () => {
    const result = buildJunit({
      checks: [
        { id: 'pass-check', findings: [] },
        { id: 'fail-check', severity: 'warning', findings: [{ message: 'issue', severity: 'warning' }] }
      ]
    });
    const xml = formatJunit(result);
    assert.ok(xml.includes('<?xml'));
    assert.ok(xml.includes('<testsuite'));
    assert.ok(xml.includes('</testsuite>'));
    assert.ok(xml.includes('<testcase'));
  });

  it('escapes special characters', () => {
    const result = buildJunit({
      checks: [{
        id: 'test<>&"', severity: 'info',
        findings: [{ message: 'has <html> & "quotes"', severity: 'info' }]
      }]
    });
    const xml = formatJunit(result);
    assert.ok(xml.includes('&lt;'));
    assert.ok(xml.includes('&amp;'));
    assert.ok(xml.includes('&quot;'));
  });
});

describe('esc', () => {
  it('escapes all XML entities', () => {
    assert.equal(esc('<>&"\''), '&lt;&gt;&amp;&quot;&apos;');
  });

  it('handles empty', () => {
    assert.equal(esc(''), '');
    assert.equal(esc(null), '');
  });
});
