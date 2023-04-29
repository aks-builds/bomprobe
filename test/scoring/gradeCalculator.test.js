const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculateGrade, gradeDescription, formatGradeReport } = require('../../src/scoring/gradeCalculator');

describe('grade calculator', () => {
  it('gives A for 90+', () => assert.equal(calculateGrade(95), 'A'));
  it('gives B for 80-89', () => assert.equal(calculateGrade(85), 'B'));
  it('gives C for 70-79', () => assert.equal(calculateGrade(72), 'C'));
  it('gives D for 60-69', () => assert.equal(calculateGrade(65), 'D'));
  it('gives F below 60', () => assert.equal(calculateGrade(45), 'F'));

  it('returns description for grade', () => {
    assert.ok(gradeDescription('A').includes('Excellent'));
  });

  it('formats grade report with next grade info', () => {
    const report = formatGradeReport(75);
    assert.equal(report.grade, 'C');
    assert.ok(report.passingGrade);
    assert.equal(report.nextGrade, 'B');
    assert.equal(report.pointsToNext, 5);
  });

  it('no next grade for A', () => {
    const report = formatGradeReport(95);
    assert.equal(report.nextGrade, null);
    assert.equal(report.pointsToNext, 0);
  });
});
