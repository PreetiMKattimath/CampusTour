/**
 * Academic calculation utilities for Nagarjuna College Of Engineering and Technology Academic Management Portal
 * Implements flexible credit-based system, attendance thresholds, SGPA/CGPA, and fee balance logic.
 */

export interface GradeEntry {
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface FeeItem {
  id: string;
  label: string;
  amount: number;
}

/**
 * Calculates attendance percentage rounded to 1 decimal place.
 */
export function calculateAttendancePercentage(attended: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round((attended / total) * 1000) / 10;
}

/**
 * Evaluates attendance compliance based on departmental policy.
 * Case Study Note: Computer Science has 85% requirement; Mechanical and others follow 75%.
 */
export function getAttendanceStatus(
  percentage: number,
  departmentThreshold: number = 85
): {
  status: 'safe' | 'warning' | 'critical';
  threshold: number;
  deficit: number;
  message: string;
} {
  const deficit = Math.max(0, Math.round((departmentThreshold - percentage) * 10) / 10);

  if (percentage >= departmentThreshold) {
    return {
      status: 'safe',
      threshold: departmentThreshold,
      deficit: 0,
      message: 'Attendance meets academic regulation guidelines.',
    };
  } else if (percentage >= departmentThreshold - 10) {
    return {
      status: 'warning',
      threshold: departmentThreshold,
      deficit,
      message: `Caution: Attendance is ${deficit}% below the required ${departmentThreshold}% threshold. Automated warning sent.`,
    };
  } else {
    return {
      status: 'critical',
      threshold: departmentThreshold,
      deficit,
      message: `Critical alert: Attendance is severely below the ${departmentThreshold}% minimum. Attendance condonation application required to be eligible for semester examinations.`,
    };
  }
}

/**
 * Evaluates if an attendance condonation application can be granted.
 * University policy allows condonation for up to 10% shortage with documented medical/sports grounds.
 */
export function evaluateCondonation(
  percentage: number,
  departmentThreshold: number,
  hasValidDocument: boolean
): {
  eligible: boolean;
  shortage: number;
  allowableDeficit: number;
  reason: string;
} {
  const shortage = Math.max(0, Math.round((departmentThreshold - percentage) * 10) / 10);
  const allowableDeficit = 10; // Max 10% condonation permitted by Academic Council

  if (shortage === 0) {
    return {
      eligible: true,
      shortage: 0,
      allowableDeficit,
      reason: 'No condonation required. Attendance satisfies department threshold.',
    };
  }

  if (shortage > allowableDeficit) {
    return {
      eligible: false,
      shortage,
      allowableDeficit,
      reason: `Deficit of ${shortage}% exceeds maximum permissible condonation limit of ${allowableDeficit}%. Mandatory detainment review.`,
    };
  }

  if (!hasValidDocument) {
    return {
      eligible: false,
      shortage,
      allowableDeficit,
      reason: 'Official documentation (medical certificate or university representation proof) is mandatory.',
    };
  }

  return {
    eligible: true,
    shortage,
    allowableDeficit,
    reason: `Condonation of ${shortage}% approved under official University academic regulations.`,
  };
}

/**
 * Calculates Semester Grade Point Average (SGPA) based on 10-point scale.
 */
export function calculateSGPA(grades: { credits: number; gradePoint: number }[]): number {
  if (!grades || grades.length === 0) return 0;

  const totalCredits = grades.reduce((acc, g) => acc + g.credits, 0);
  if (totalCredits === 0) return 0;

  const weightedPoints = grades.reduce((acc, g) => acc + g.credits * g.gradePoint, 0);
  return Math.round((weightedPoints / totalCredits) * 100) / 100;
}

/**
 * Converts percentage marks (0-100) into University letter grade and grade point.
 */
export function convertMarksToGrade(marks: number): { grade: string; gradePoint: number } {
  if (marks >= 90) return { grade: 'O', gradePoint: 10 };
  if (marks >= 80) return { grade: 'A+', gradePoint: 9 };
  if (marks >= 70) return { grade: 'A', gradePoint: 8 };
  if (marks >= 60) return { grade: 'B+', gradePoint: 7 };
  if (marks >= 50) return { grade: 'B', gradePoint: 6 };
  if (marks >= 40) return { grade: 'C', gradePoint: 5 };
  return { grade: 'F', gradePoint: 0 };
}

/**
 * Calculates fee accounting details including government scholarship offsets.
 */
export function calculateFeeBalances(
  items: FeeItem[],
  scholarshipDeduction: number = 0,
  paidAmount: number = 0
): {
  grossTotal: number;
  netPayable: number;
  pendingBalance: number;
  isFullyPaid: boolean;
} {
  const grossTotal = items.reduce((acc, item) => acc + item.amount, 0);
  const netPayable = Math.max(0, grossTotal - scholarshipDeduction);
  const pendingBalance = Math.max(0, netPayable - paidAmount);

  return {
    grossTotal,
    netPayable,
    pendingBalance,
    isFullyPaid: pendingBalance === 0,
  };
}

/**
 * Validates course selection limits under the Flexible Credit-Based Academic System (Change 1).
 */
export function validateCreditLimits(
  selectedCredits: number,
  minCredits: number = 20,
  maxCredits: number = 28
): {
  valid: boolean;
  message: string;
} {
  if (selectedCredits < minCredits) {
    return {
      valid: false,
      message: `Minimum ${minCredits} credits required per semester. You currently have ${selectedCredits} credits selected.`,
    };
  }
  if (selectedCredits > maxCredits) {
    return {
      valid: false,
      message: `Maximum credit limit is ${maxCredits}. Current selection exceeds limit by ${selectedCredits - maxCredits} credits.`,
    };
  }
  return {
    valid: true,
    message: `Credit allocation (${selectedCredits}/${maxCredits}) is optimal and approved for registration.`,
  };
}
