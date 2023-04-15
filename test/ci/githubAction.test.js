const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { generateAnnotations, toGithubOutput } = require('../../src/ci/githubAction');

describe('GitHub Action helpers', () => {
  const result = {
    score: { overall: 82 },
    grade: 'B',
    checks: [
      { id: 'component-name', name: 'Component Name', findings: [{ severity: 'error', message: 'Missing name' }] },
      { id: 'component-version', name: 'Component Version', findings: [{ severity: 'info', message: 'All good' }] }
    ]
  };

  it('generates annotations for errors and warnings only', () => {
    const annotations = generateAnnotations(result);
    assert.equal(annotations.length, 1);
    assert.equal(annotations[0].level, 'error');
    assert.ok(annotations[0].message.includes('component-name'));
  });

  it('outputs GitHub Action format', () => {
    const output = toGithubOutput(result, { passed: true });
    assert.ok(output.includes('score=82'));
    assert.ok(output.includes('grade=B'));
    assert.ok(output.includes('passed=true'));
    assert.ok(output.includes('findings=2'));
  });

  it('defaults passed to true with no gate', () => {
    const output = toGithubOutput(result);
    assert.ok(output.includes('passed=true'));
  });
});
