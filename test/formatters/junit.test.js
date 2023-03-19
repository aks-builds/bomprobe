const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/junit');

describe('junit formatter', () => {
  const result = {
    file: 'sbom.json',
    format: 'cyclonedx',
    score: { overall: 6.0 },
    componentCount: 2,
    checks: [
      { id: 'component-name', name: 'Component Name', findings: [] },
      {
        id: 'component-version',
        name: 'Component Version',
        findings: [{ severity: 'warning', component: 'x', message: 'missing version' }]
      }
    ]
  };

  it('outputs valid XML structure', () => {
    const output = formatResult(result);
    assert.ok(output.startsWith('<?xml'));
    assert.ok(output.includes('<testsuites>'));
    assert.ok(output.includes('</testsuites>'));
  });

  it('counts tests and failures', () => {
    const output = formatResult(result);
    assert.ok(output.includes('tests="2"'));
    assert.ok(output.includes('failures="1"'));
  });

  it('marks passing checks as testcases without failure', () => {
    const output = formatResult(result);
    assert.ok(output.includes('name="Component Name"'));
  });

  it('wraps findings in CDATA failure element', () => {
    const output = formatResult(result);
    assert.ok(output.includes('<![CDATA['));
    assert.ok(output.includes('missing version'));
  });

  it('handles all-passing checks', () => {
    const clean = {
      ...result,
      checks: [{ id: 'a', name: 'A', findings: [] }]
    };
    const output = formatResult(clean);
    assert.ok(output.includes('failures="0"'));
    assert.ok(!output.includes('<failure'));
  });
});
