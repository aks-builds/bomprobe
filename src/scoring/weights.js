const DEFAULT_WEIGHTS = {
  metadata: 0.25,
  components: 0.35,
  dependencies: 0.20,
  compliance: 0.20
};

function normalizeWeights(custom = {}) {
  const merged = { ...DEFAULT_WEIGHTS, ...custom };
  const total = Object.values(merged).reduce((s, v) => s + v, 0);
  if (total === 0) return DEFAULT_WEIGHTS;
  const normalized = {};
  for (const [key, val] of Object.entries(merged)) {
    normalized[key] = val / total;
  }
  return normalized;
}

function applyWeights(scores, weights) {
  let total = 0;
  for (const [category, score] of Object.entries(scores)) {
    const weight = weights[category] || 0;
    total += score * weight;
  }
  return Math.round(total * 100) / 100;
}

module.exports = { DEFAULT_WEIGHTS, normalizeWeights, applyWeights };
