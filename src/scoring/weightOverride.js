function applyWeightOverrides(checks, overrides) {
  if (!overrides || typeof overrides !== 'object') return checks;

  return checks.map(c => {
    const override = overrides[c.id];
    if (override === undefined) return c;

    if (override === 0) {
      return { ...c, weight: 0, disabled: true };
    }

    return { ...c, weight: Number(override) };
  });
}

function parseWeightString(str) {
  const overrides = {};
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);

  for (const part of parts) {
    const [id, val] = part.split('=').map(s => s.trim());
    if (id && val !== undefined) {
      overrides[id] = Number(val);
    }
  }

  return overrides;
}

module.exports = { applyWeightOverrides, parseWeightString };
