import { ComplaintStatus, ComplaintPriority, ComplaintCategory, Role } from '@/constants/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeId?: string;
  department?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  reporterId: string;
  reporterName: string;
  assignedManagerId?: string;
  assignedManagerName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  note: string;
  updatedBy: string;
  updatedByName: string;
  createdAt: string;
}
