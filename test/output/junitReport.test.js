const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatJunitReport } = require('../../src/output/junitReport');

describe('junit report', () => {
  it('formats passing checks', () => {
    const results = [{ id: 'comp-name', findings: [] }];
    const xml = formatJunitReport(results);
    assert.ok(xml.includes('tests="1" failures="0"'));
    assert.ok(xml.includes('comp-name'));
  });

  it('marks errors as failures', () => {
    const results = [{ id: 'comp-name', findings: [
      { severity: 'error', message: 'Missing name' }
    ]}];
    const xml = formatJunitReport(results);
    assert.ok(xml.includes('failures="1"'));
    assert.ok(xml.includes('<failure'));
  });

  it('puts warnings in system-out', () => {
    const results = [{ id: 'comp-ver', findings: [
      { severity: 'warning', message: 'Loose version' }
    ]}];
    const xml = formatJunitReport(results);
    assert.ok(xml.includes('<system-out>'));
    assert.ok(xml.includes('Loose version'));
  });

  it('escapes XML special characters', () => {
    const results = [{ id: 'test', findings: [
      { severity: 'error', message: 'a < b & c > d' }
    ]}];
    const xml = formatJunitReport(results);
    assert.ok(xml.includes('&lt;'));
    assert.ok(xml.includes('&amp;'));
  });

  it('uses custom file name', () => {
    const xml = formatJunitReport([], 'my-bom.json');
    assert.ok(xml.includes('file="my-bom.json"'));
  });
});
