const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { grade, gradeLabel, gradeWithLabel } = require('../../src/scoring/grading');

describe('scoring grades', () => {
  it('gives A for 90+', () => assert.equal(grade(95), 'A'));
  it('gives B for 80-89', () => assert.equal(grade(85), 'B'));
  it('gives C for 70-79', () => assert.equal(grade(75), 'C'));
  it('gives D for 60-69', () => assert.equal(grade(65), 'D'));
  it('gives F below 60', () => assert.equal(grade(45), 'F'));

  it('labels A as Excellent', () => assert.equal(gradeLabel('A'), 'Excellent'));
  it('labels F as Failing', () => assert.equal(gradeLabel('F'), 'Failing'));

  it('combined grade with label', () => {
    const result = gradeWithLabel(92);
    assert.equal(result.letter, 'A');
    assert.equal(result.label, 'Excellent');
    assert.equal(result.score, 92);
  });
});
