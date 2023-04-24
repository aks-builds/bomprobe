const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-file-info');

describe('spdx-file-info check', () => {
  it('passes complete file entry', () => {
    const sbom = { files: [{
      fileName: './src/main.js',
      checksums: [{ algorithm: 'SHA256', checksumValue: 'abc' }],
      licenseConcluded: 'MIT',
      copyrightText: '(c) 2023'
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing checksum', () => {
    const sbom = { files: [{ fileName: 'a.js', licenseConcluded: 'MIT', copyrightText: 'x' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('checksum')));
  });

  it('flags missing license', () => {
    const sbom = { files: [{ fileName: 'a.js', checksums: [{}], copyrightText: 'x' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('license')));
  });

  it('flags missing copyright', () => {
    const sbom = { files: [{ fileName: 'a.js', checksums: [{}], licenseConcluded: 'MIT' }] };
    assert.ok(check.run(sbom).some(f => f.message.includes('copyright')));
  });

  it('handles no files', () => {
    assert.equal(check.run({}).length, 0);
  });
});
