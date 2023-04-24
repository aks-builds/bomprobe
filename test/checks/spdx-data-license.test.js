const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-data-license');

describe('spdx-data-license check', () => {
  it('passes with CC0-1.0', () => {
    assert.equal(check.run({ spdxVersion: 'SPDX-2.3', dataLicense: 'CC0-1.0' }).length, 0);
  });

  it('flags missing dataLicense on SPDX doc', () => {
    const findings = check.run({ spdxVersion: 'SPDX-2.3' });
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('missing'));
  });

  it('flags wrong dataLicense', () => {
    const findings = check.run({ dataLicense: 'MIT' });
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('MIT'));
  });

  it('ignores non-SPDX without dataLicense', () => {
    assert.equal(check.run({}).length, 0);
  });
});
