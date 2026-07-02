export type Role = "chairman" | "cse" | "ece" | "civil" | "me";

export type Status = "Pending" | "In Progress" | "Completed" | "Blocked" | "Not Applicable";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Criterion {
  id: string;
  title: string;
  description: string;
  category: string; // Section name like "1. Outcome-Based Curriculum"
  status: Status;
  priority: Priority;
  department: Role;
  assignedTo: string;
  dueDate: string;
  remarks: string;
  chairmanFeedback?: string;
  completionDate?: string;
  updatedBy?: string;
  lastUpdated: string;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  timestamp: string;
  user: string;
  action: string;
  previousValue?: string;
  newValue?: string;
}

export interface DepartmentInfo {
  id: Role;
  name: string;
  shortName: string;
  color: string;
  coordinator: string;
}

export interface UserCredentials {
  username: string;
  password: string;
  role: Role;
  name: string;
  department: string;
}
