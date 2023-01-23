function scoreComponent(component) {
  let earned = 0;
  let possible = 0;

  const fields = [
    { key: 'name', weight: 1.0 },
    { key: 'version', weight: 1.0 },
    { key: 'supplier', weight: 0.8 },
    { key: 'license', weight: 0.8 },
    { key: 'purl', weight: 0.9 },
    { key: 'description', weight: 0.3 }
  ];

  for (const f of fields) {
    possible += f.weight;
    if (component[f.key]) earned += f.weight;
  }

  if (component.hashes > 0) earned += 0.5;
  possible += 0.5;

  return possible > 0 ? (earned / possible) * 10 : 0;
}

function scoreMetadata(metadata) {
  let earned = 0;
  let possible = 0;

  if (metadata.author) earned += 0.7;
  possible += 0.7;

  if (metadata.timestamp) earned += 0.7;
  possible += 0.7;

  if (metadata.toolCount > 0) earned += 0.5;
  possible += 0.5;

  return possible > 0 ? (earned / possible) * 10 : 0;
}

function scoreSbom(sbom) {
  const componentScores = sbom.components.map(c => scoreComponent(c));
  const avgComponent = componentScores.length > 0
    ? componentScores.reduce((a, b) => a + b, 0) / componentScores.length
    : 0;

  const metadataScore = scoreMetadata(sbom.metadata);
  const depCoverage = sbom.dependencyGraph.coverage * 10;

  const overall = (avgComponent * 0.6) + (metadataScore * 0.2) + (depCoverage * 0.2);

  return {
    overall: round(overall),
    components: {
      average: round(avgComponent),
      scores: componentScores.map(s => round(s)),
      count: sbom.components.length
    },
    metadata: round(metadataScore),
    dependencyCoverage: round(depCoverage)
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}

module.exports = { scoreSbom, scoreComponent, scoreMetadata };
