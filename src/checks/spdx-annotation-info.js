module.exports = {
  id: 'spdx-annotation-info',
  name: 'SPDX Annotation Completeness',
  description: 'SPDX annotations should have annotator, date, type, and comment',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const annotations = sbom.annotations || [];

    for (let i = 0; i < annotations.length; i++) {
      const ann = annotations[i];
      const label = `Annotation #${i + 1}`;

      if (!ann.annotator) {
        findings.push({ severity: 'info', message: `${label} missing annotator` });
      }
      if (!ann.annotationDate) {
        findings.push({ severity: 'info', message: `${label} missing date` });
      }
      if (!ann.annotationType) {
        findings.push({ severity: 'warning', message: `${label} missing annotation type` });
      }
      if (!ann.comment) {
        findings.push({ severity: 'info', message: `${label} missing comment text` });
      }
    }

    return findings;
  }
};
