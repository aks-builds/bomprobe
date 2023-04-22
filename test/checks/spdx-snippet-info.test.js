const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-snippet-info');

describe('spdx-snippet-info check', () => {
  it('passes complete snippet', () => {
    const sbom = { snippets: [{
      name: 'helper',
      snippetFromFile: 'SPDXRef-File',
      ranges: [{ startPointer: { offset: 0 }, endPointer: { offset: 100 } }],
      licenseConcluded: 'MIT'
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing snippetFromFile', () => {
    const sbom = { snippets: [{ name: 'x', ranges: [{}], licenseConcluded: 'MIT' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('snippetFromFile')));
  });

  it('flags missing ranges', () => {
    const sbom = { snippets: [{ name: 'x', snippetFromFile: 'f', licenseConcluded: 'MIT' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('range')));
  });

  it('flags missing license', () => {
    const sbom = { snippets: [{ name: 'x', snippetFromFile: 'f', ranges: [{}] }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('license')));
  });

  it('handles no snippets', () => {
    assert.equal(check.run({}).length, 0);
  });
});
