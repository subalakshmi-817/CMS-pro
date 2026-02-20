export const COMPLAINT_CATEGORIES = [
  { id: 'wifi', label: 'WiFi & Network', icon: 'wifi' },
  { id: 'lab', label: 'Lab & Systems', icon: 'computer' },
  { id: 'hostel', label: 'Hostel Facilities', icon: 'home' },
  { id: 'electrical', label: 'Electrical', icon: 'lightbulb' },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'build' },
  { id: 'library', label: 'Library', icon: 'book' },
  { id: 'others', label: 'Others', icon: 'more-horiz' },
];

export const LOCATIONS = [
  'Block A',
  'Block B',
  'Block C',
  'Lab - Computer Science',
  'Lab - Electronics',
  'Lab - Mechanical',
  'Hostel - Boys',
  'Hostel - Girls',
  'Library - Main',
  'Library - Reference',
  'Cafeteria',
  'Auditorium',
  'Sports Complex',
  'Administrative Block',
  'Others',
];

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#10b981' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'high', label: 'High', color: '#ef4444' },
];

export const STATUSES = [
  { id: 'pending', label: 'Pending', color: '#f59e0b' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'resolved', label: 'Resolved', color: '#10b981' },
];

export const ROLES = {
  STAFF: 'staff',
  ADMIN: 'admin',
  MANAGER: 'manager',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high';
export type ComplaintCategory = 'wifi' | 'lab' | 'hostel' | 'electrical' | 'infrastructure' | 'library' | 'others';
