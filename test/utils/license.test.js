const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { isValidSpdx, isCopyleft, isPermissive, parseExpression, classify } = require('../../src/utils/license');

describe('license utilities', () => {
  it('recognizes valid SPDX identifiers', () => {
    assert.ok(isValidSpdx('MIT'));
    assert.ok(isValidSpdx('Apache-2.0'));
    assert.ok(!isValidSpdx('FAKE-1.0'));
  });

  it('classifies copyleft licenses', () => {
    assert.ok(isCopyleft('GPL-3.0-only'));
    assert.ok(isCopyleft('AGPL-3.0-or-later'));
    assert.ok(!isCopyleft('MIT'));
  });

  it('classifies permissive licenses', () => {
    assert.ok(isPermissive('MIT'));
    assert.ok(isPermissive('BSD-3-Clause'));
    assert.ok(!isPermissive('GPL-3.0-only'));
  });

  it('parses simple license expression', () => {
    const result = parseExpression('MIT');
    assert.deepEqual(result.licenses, ['MIT']);
    assert.deepEqual(result.operators, []);
  });

  it('parses compound license expression', () => {
    const result = parseExpression('MIT OR Apache-2.0');
    assert.deepEqual(result.licenses, ['MIT', 'Apache-2.0']);
    assert.deepEqual(result.operators, ['OR']);
  });

  it('parses AND expressions', () => {
    const result = parseExpression('GPL-3.0-only AND MIT');
    assert.deepEqual(result.operators, ['AND']);
  });

  it('returns null for empty input', () => {
    assert.equal(parseExpression(null), null);
    assert.equal(parseExpression(''), null);
  });

  it('classifies license type', () => {
    assert.equal(classify('MIT'), 'permissive');
    assert.equal(classify('GPL-3.0-only'), 'copyleft');
    assert.equal(classify('FAKE-1.0'), 'unknown');
  });
});
