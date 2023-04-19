const OPERATORS = {
  'eq': (a, b) => a === b,
  'ne': (a, b) => a !== b,
  'gt': (a, b) => a > b,
  'gte': (a, b) => a >= b,
  'lt': (a, b) => a < b,
  'lte': (a, b) => a <= b,
  'in': (a, b) => Array.isArray(b) && b.includes(a),
  'contains': (a, b) => typeof a === 'string' && a.includes(b),
  'matches': (a, b) => typeof a === 'string' && new RegExp(b).test(a)
};

function parseRule(rule) {
  if (!rule || typeof rule !== 'object') return null;
  const { field, operator, value, severity, message } = rule;
  if (!field || !operator || !OPERATORS[operator]) return null;

  return {
    field,
    operator,
    value,
    severity: severity || 'warning',
    message: message || `Policy violation: ${field} ${operator} ${JSON.stringify(value)}`,
    test: (actual) => OPERATORS[operator](actual, value)
  };
}

function parsePolicy(rules) {
  if (!Array.isArray(rules)) return [];
  return rules.map(parseRule).filter(Boolean);
}

module.exports = { parseRule, parsePolicy, OPERATORS };
