import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Complaint, ComplaintUpdate } from '@/types';

const KEYS = {
  CURRENT_USER: '@current_user',
  USERS: '@users',
  COMPLAINTS: '@complaints',
  COMPLAINT_UPDATES: '@complaint_updates',
};

// Initialize mock data
const MOCK_USERS: User[] = [
  {
    id: 'student1',
    name: 'Rahul Kumar',
    email: 'student@campus.edu',
    role: 'student',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
  },
  {
    id: 'admin1',
    name: 'Dr. Sharma',
    email: 'admin@campus.edu',
    role: 'admin',
    department: 'Administration',
  },
  {
    id: 'staff1',
    name: 'Ramesh Patel',
    email: 'staff@campus.edu',
    role: 'staff',
    department: 'IT Support',
  },
  {
    id: 'staff2',
    name: 'Priya Singh',
    email: 'staff2@campus.edu',
    role: 'staff',
    department: 'Facilities',
  },
];

export async function initializeStorage(): Promise<void> {
  try {
    const existingUsers = await AsyncStorage.getItem(KEYS.USERS);
    if (!existingUsers) {
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    
    const existingComplaints = await AsyncStorage.getItem(KEYS.COMPLAINTS);
    if (!existingComplaints) {
      await AsyncStorage.setItem(KEYS.COMPLAINTS, JSON.stringify([]));
    }
    
    const existingUpdates = await AsyncStorage.getItem(KEYS.COMPLAINT_UPDATES);
    if (!existingUpdates) {
      await AsyncStorage.setItem(KEYS.COMPLAINT_UPDATES, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const usersJson = await AsyncStorage.getItem(KEYS.USERS);
    if (!usersJson) return null;
    
    const users: User[] = JSON.parse(usersJson);
    const user = users.find(u => u.email === email);
    
    if (user) {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.CURRENT_USER);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const userJson = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const complaintsJson = await AsyncStorage.getItem(KEYS.COMPLAINTS);
    return complaintsJson ? JSON.parse(complaintsJson) : [];
  } catch (error) {
    console.error('Failed to get complaints:', error);
    return [];
  }
}

export async function saveComplaint(complaint: Complaint): Promise<void> {
  try {
    const complaints = await getComplaints();
    const existingIndex = complaints.findIndex(c => c.id === complaint.id);
    
    if (existingIndex >= 0) {
      complaints[existingIndex] = complaint;
    } else {
      complaints.push(complaint);
    }
    
    await AsyncStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
  } catch (error) {
    console.error('Failed to save complaint:', error);
    throw error;
  }
}

export async function getComplaintUpdates(complaintId: string): Promise<ComplaintUpdate[]> {
  try {
    const updatesJson = await AsyncStorage.getItem(KEYS.COMPLAINT_UPDATES);
    const allUpdates: ComplaintUpdate[] = updatesJson ? JSON.parse(updatesJson) : [];
    return allUpdates.filter(u => u.complaintId === complaintId);
  } catch (error) {
    console.error('Failed to get complaint updates:', error);
    return [];
  }
}

export async function saveComplaintUpdate(update: ComplaintUpdate): Promise<void> {
  try {
    const updatesJson = await AsyncStorage.getItem(KEYS.COMPLAINT_UPDATES);
    const updates: ComplaintUpdate[] = updatesJson ? JSON.parse(updatesJson) : [];
    updates.push(update);
    await AsyncStorage.setItem(KEYS.COMPLAINT_UPDATES, JSON.stringify(updates));
  } catch (error) {
    console.error('Failed to save complaint update:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersJson = await AsyncStorage.getItem(KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}
