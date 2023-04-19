const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseRule, parsePolicy, OPERATORS } = require('../../src/policy/parser');

describe('policy parser', () => {
  it('parses valid rule', () => {
    const rule = parseRule({ field: 'score', operator: 'gte', value: 80 });
    assert.ok(rule);
    assert.equal(rule.field, 'score');
    assert.equal(rule.test(85), true);
    assert.equal(rule.test(70), false);
  });

  it('supports all operators', () => {
    assert.equal(OPERATORS.eq(1, 1), true);
    assert.equal(OPERATORS.ne(1, 2), true);
    assert.equal(OPERATORS.gt(2, 1), true);
    assert.equal(OPERATORS.gte(2, 2), true);
    assert.equal(OPERATORS.lt(1, 2), true);
    assert.equal(OPERATORS.lte(2, 2), true);
    assert.equal(OPERATORS.in('a', ['a', 'b']), true);
    assert.equal(OPERATORS.contains('hello world', 'world'), true);
    assert.equal(OPERATORS.matches('abc123', '^abc'), true);
  });

  it('returns null for invalid rule', () => {
    assert.equal(parseRule(null), null);
    assert.equal(parseRule({}), null);
    assert.equal(parseRule({ field: 'x', operator: 'bogus', value: 1 }), null);
  });

  it('defaults severity to warning', () => {
    const rule = parseRule({ field: 'score', operator: 'gte', value: 80 });
    assert.equal(rule.severity, 'warning');
  });

  it('allows custom severity and message', () => {
    const rule = parseRule({ field: 'score', operator: 'gte', value: 80, severity: 'error', message: 'Score too low' });
    assert.equal(rule.severity, 'error');
    assert.equal(rule.message, 'Score too low');
  });

  it('parses array of rules', () => {
    const rules = parsePolicy([
      { field: 'score', operator: 'gte', value: 80 },
      { field: 'grade', operator: 'in', value: ['A', 'B'] },
      null
    ]);
    assert.equal(rules.length, 2);
  });
});
