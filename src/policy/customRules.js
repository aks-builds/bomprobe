const { readFileSync } = require('node:fs');

function loadPolicy(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const policy = JSON.parse(raw);
  validatePolicy(policy);
  return policy;
}

function validatePolicy(policy) {
  if (!policy.rules || !Array.isArray(policy.rules)) {
    throw new Error('Policy must have a "rules" array');
  }
  for (const rule of policy.rules) {
    if (!rule.id) throw new Error('Each rule must have an "id"');
    if (!rule.field) throw new Error(`Rule ${rule.id}: missing "field"`);
    if (!rule.operator) throw new Error(`Rule ${rule.id}: missing "operator"`);
  }
}

const operators = {
  exists: (val) => val !== undefined && val !== null && val !== '',
  not_exists: (val) => val === undefined || val === null || val === '',
  equals: (val, expected) => val === expected,
  not_equals: (val, expected) => val !== expected,
  contains: (val, substr) => typeof val === 'string' && val.includes(substr),
  matches: (val, pattern) => typeof val === 'string' && new RegExp(pattern).test(val),
  gt: (val, n) => typeof val === 'number' && val > n,
  lt: (val, n) => typeof val === 'number' && val < n,
  in: (val, list) => Array.isArray(list) && list.includes(val),
  min_length: (val, n) => Array.isArray(val) && val.length >= n,
  max_length: (val, n) => Array.isArray(val) && val.length <= n
};

function resolveField(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

function evaluateRule(rule, component) {
  const val = resolveField(component, rule.field);
  const op = operators[rule.operator];
  if (!op) throw new Error(`Unknown operator: ${rule.operator}`);
  return op(val, rule.value);
}

function runPolicy(policy, sbom) {
  const findings = [];
  const components = sbom.components || [];

  for (const rule of policy.rules) {
    const target = rule.target || 'component';

    if (target === 'component') {
      for (const c of components) {
        const pass = evaluateRule(rule, c);
        if (!pass) {
          findings.push({
            ruleId: rule.id,
            severity: rule.severity || 'warning',
            component: c.name || 'unnamed',
            message: rule.message || `${c.name || 'unnamed'} failed rule ${rule.id}: ${rule.field} ${rule.operator}`
          });
        }
      }
    } else if (target === 'metadata') {
      const pass = evaluateRule(rule, sbom.metadata || {});
      if (!pass) {
        findings.push({
          ruleId: rule.id,
          severity: rule.severity || 'warning',
          message: rule.message || `Metadata failed rule ${rule.id}: ${rule.field} ${rule.operator}`
        });
      }
    }
  }

  return findings;
}

module.exports = { loadPolicy, validatePolicy, evaluateRule, runPolicy, resolveField };
