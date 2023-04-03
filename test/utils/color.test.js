const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const color = require('../../src/utils/color');

describe('color utilities', () => {
  it('wraps text in red ANSI codes', () => {
    color.enable();
    const result = color.red('err');
    assert.ok(result.includes('\x1b[31m'));
    assert.ok(result.includes('err'));
  });

  it('wraps text in green ANSI codes', () => {
    color.enable();
    assert.ok(color.green('ok').includes('\x1b[32m'));
  });

  it('returns plain text when disabled', () => {
    color.disable();
    assert.equal(color.red('err'), 'err');
    assert.equal(color.yellow('warn'), 'warn');
    assert.equal(color.bold('x'), 'x');
    color.enable();
  });

  it('supports bold', () => {
    color.enable();
    assert.ok(color.bold('title').includes('\x1b[1m'));
  });

  it('supports dim', () => {
    color.enable();
    assert.ok(color.dim('faded').includes('\x1b[2m'));
  });
});
