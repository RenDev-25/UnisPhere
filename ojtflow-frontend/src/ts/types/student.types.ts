// Shared student portal and coordinator student record types.
export interface StudentDashboardData {
  student:{name:string;firstName:string;studentNumber:string;college:string;program:string;academicYear:string};
  eligibility:string; deploymentStatus:string;
  applications:{total:number;underReview:number;accepted:number;rejected:number;pending:number;cancelled:number};
  requirements:{total:number;completed:number;pendingVerification:number;forRevision:number};
}
export interface RegisteredStudentRecord {
  id:string; fullName:string; email:string; studentNumber:string; program:string;
  eligibilityStatus:'Eligible'|'For Review'|'Incomplete'|'Not Eligible';
  ojtStatus:'Not Started'|'In Progress'|'Completed';
}
