const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatCsv } = require('../../src/output/csv');

describe('csv output', () => {
  it('renders CSV header', () => {
    const result = { results: [] };
    const csv = formatCsv(result);
    assert.ok(csv.startsWith('check,severity,component,message'));
  });

  it('renders findings as rows', () => {
    const result = {
      results: [{
        name: 'Component Version',
        findings: [{ severity: 'warning', component: 'lodash', message: 'Missing version' }]
      }]
    };
    const csv = formatCsv(result);
    const lines = csv.split('\n');
    assert.equal(lines.length, 2);
    assert.ok(lines[1].includes('Component Version'));
    assert.ok(lines[1].includes('warning'));
  });

  it('escapes commas in values', () => {
    const result = {
      results: [{
        name: 'test',
        findings: [{ severity: 'info', component: '', message: 'a, b, c' }]
      }]
    };
    const csv = formatCsv(result);
    assert.ok(csv.includes('"a, b, c"'));
  });

  it('escapes double quotes', () => {
    const result = {
      results: [{
        name: 'test',
        findings: [{ severity: 'info', component: '', message: 'value "quoted"' }]
      }]
    };
    const csv = formatCsv(result);
    assert.ok(csv.includes('""quoted""'));
  });

  it('handles empty results', () => {
    const csv = formatCsv({ results: [{ name: 'a', findings: [] }] });
    assert.equal(csv.split('\n').length, 1);
  });
});
