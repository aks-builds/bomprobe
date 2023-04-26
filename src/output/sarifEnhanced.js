function formatSarifEnhanced(result) {
  const rules = [];
  const results = [];
  const ruleMap = new Map();
  let idx = 0;

  for (const check of result.checks) {
    if (!ruleMap.has(check.id)) {
      ruleMap.set(check.id, idx);
      rules.push({
        id: check.id,
        name: check.name,
        shortDescription: { text: check.name },
        defaultConfiguration: {
          level: 'warning'
        },
        properties: {
          weight: check.weight
        }
      });
      idx++;
    }

    for (const f of check.findings) {
      results.push({
        ruleId: check.id,
        ruleIndex: ruleMap.get(check.id),
        level: sarifLevel(f.severity),
        message: { text: f.message },
        properties: {
          component: f.component || null
        }
      });
    }
  }

  return {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [{
      tool: {
        driver: {
          name: 'bomprobe',
          informationUri: 'https://github.com/aks-builds/bomprobe',
          rules
        }
      },
      results
    }]
  };
}

function sarifLevel(severity) {
  if (severity === 'error') return 'error';
  if (severity === 'warning') return 'warning';
  return 'note';
}

module.exports = { formatSarifEnhanced };
