const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/csv');

describe('csv formatter', () => {
  it('outputs header row', () => {
    const result = { checks: [] };
    const output = formatResult(result);
    assert.equal(output, 'severity,check,component,message');
  });

  it('outputs one row per finding', () => {
    const result = {
      checks: [
        {
          id: 'component-version',
          findings: [
            { severity: 'warning', component: 'lodash', message: 'lodash has no version' }
          ]
        }
      ]
    };
    const lines = formatResult(result).split('\n');
    assert.equal(lines.length, 2);
    assert.equal(lines[1], 'warning,component-version,lodash,lodash has no version');
  });

  it('escapes fields with commas', () => {
    const result = {
      checks: [
        {
          id: 'test',
          findings: [
            { severity: 'info', component: 'a,b', message: 'has comma' }
          ]
        }
      ]
    };
    const lines = formatResult(result).split('\n');
    assert.ok(lines[1].includes('"a,b"'));
  });
});
