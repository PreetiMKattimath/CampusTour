import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAttendancePercentage,
  getAttendanceStatus,
  evaluateCondonation,
  calculateSGPA,
  convertMarksToGrade,
  calculateFeeBalances,
  validateCreditLimits,
} from './academicCalculations.ts';

test('calculateAttendancePercentage handles normal and edge cases', () => {
  assert.equal(calculateAttendancePercentage(38, 45), 84.4);
  assert.equal(calculateAttendancePercentage(45, 45), 100);
  assert.equal(calculateAttendancePercentage(0, 45), 0);
  assert.equal(calculateAttendancePercentage(10, 0), 100);
});

test('getAttendanceStatus handles departmental policy differences (CSE 85% vs Mech 75%)', () => {
  // CSE Student with 84% - Below 85% threshold -> warning
  const cseStudent = getAttendanceStatus(84, 85);
  assert.equal(cseStudent.status, 'warning');
  assert.equal(cseStudent.deficit, 1);

  // Same student in Mechanical (75% threshold) -> safe
  const mechStudent = getAttendanceStatus(84, 75);
  assert.equal(mechStudent.status, 'safe');
  assert.equal(mechStudent.deficit, 0);

  // Severely low attendance -> critical
  const lowStudent = getAttendanceStatus(65, 85);
  assert.equal(lowStudent.status, 'critical');
});

test('evaluateCondonation enforces policy rules', () => {
  // 78% in an 85% requirement department (shortage = 7%, within allowable 10%)
  const withCert = evaluateCondonation(78, 85, true);
  assert.equal(withCert.eligible, true);
  assert.equal(withCert.shortage, 7);

  // Missing documentation
  const withoutCert = evaluateCondonation(78, 85, false);
  assert.equal(withoutCert.eligible, false);

  // Deficit exceeds allowable 10% (e.g. 68% in 85% department = 17% deficit)
  const excessiveDeficit = evaluateCondonation(68, 85, true);
  assert.equal(excessiveDeficit.eligible, false);
});

test('calculateSGPA calculates accurate weighted averages', () => {
  const sampleGrades = [
    { credits: 4, gradePoint: 10 }, // 40
    { credits: 3, gradePoint: 9 },  // 27
    { credits: 3, gradePoint: 8 },  // 24
    { credits: 2, gradePoint: 7 },  // 14
  ];
  // Total points: 105, total credits: 12 -> 105 / 12 = 8.75
  assert.equal(calculateSGPA(sampleGrades), 8.75);
});

test('convertMarksToGrade converts standard Indian university grading scale', () => {
  assert.deepEqual(convertMarksToGrade(94), { grade: 'O', gradePoint: 10 });
  assert.deepEqual(convertMarksToGrade(85), { grade: 'A+', gradePoint: 9 });
  assert.deepEqual(convertMarksToGrade(72), { grade: 'A', gradePoint: 8 });
  assert.deepEqual(convertMarksToGrade(55), { grade: 'B', gradePoint: 6 });
  assert.deepEqual(convertMarksToGrade(32), { grade: 'F', gradePoint: 0 });
});

test('calculateFeeBalances accurately factors scholarship offsets and payments', () => {
  const feeItems = [
    { id: '1', label: 'Tuition Fee', amount: 65000 },
    { id: '2', label: 'Lab & Computer Facility', amount: 15000 },
    { id: '3', label: 'Examination Fee', amount: 5000 },
  ];
  // Gross = 85000. Scholarship = 35000. Net Payable = 50000.
  // Paid = 20000. Pending = 30000.
  const balance = calculateFeeBalances(feeItems, 35000, 20000);
  assert.equal(balance.grossTotal, 85000);
  assert.equal(balance.netPayable, 50000);
  assert.equal(balance.pendingBalance, 30000);
  assert.equal(balance.isFullyPaid, false);

  const fullyPaid = calculateFeeBalances(feeItems, 35000, 50000);
  assert.equal(fullyPaid.pendingBalance, 0);
  assert.equal(fullyPaid.isFullyPaid, true);
});

test('validateCreditLimits enforces semester bounds', () => {
  assert.equal(validateCreditLimits(18).valid, false);
  assert.equal(validateCreditLimits(30).valid, false);
  assert.equal(validateCreditLimits(24).valid, true);
});
