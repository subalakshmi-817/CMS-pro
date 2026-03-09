import { getSharedSupabaseClient } from '@/template/core/client';
import { User, Complaint, ComplaintUpdate } from '@/types';
import { Role } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CURRENT_USER: '@current_user',
};

export async function initializeStorage(): Promise<void> {
  // No explicit initialization needed for Supabase
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const supabase = getSharedSupabaseClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authUser) {
      console.error('Auth error:', authError?.message);
      return null;
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError?.message);
      return null;
    }

    const user: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      employeeId: profile.employee_id,
      department: profile.department,
    };

    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

export async function signup(
  email: string,
  password: string,
  name: string,
  role: Role,
  department: string
): Promise<User | null> {
  try {
    const supabase = getSharedSupabaseClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          department,
        }
      }
    });

    if (authError || !authUser) {
      console.error('Signup error:', authError?.message);
      return null;
    }

    // The trigger handles profile creation, but we update the department explicitly just in case
    // though the trigger should handle it if passed in metadata. 
    // Let's ensure the profile table has the info.
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        department: department,
      })
      .eq('id', authUser.id);

    if (profileError) {
      console.warn('Profile details update error:', profileError.message);
    }

    const user: User = {
      id: authUser.id,
      name,
      email,
      role,
      department,
    };

    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Signup process failed:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const supabase = getSharedSupabaseClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Supabase logout error:', error);
  } finally {
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSharedSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const user: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        employeeId: profile.employee_id,
        department: profile.department,
      };
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }

    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const supabase = getSharedSupabaseClient();
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      priority: item.priority,
      status: item.status,
      reporterId: item.reporter_id,
      reporterName: item.reporter_name,
      assignedManagerId: item.assigned_manager_id,
      assignedManagerName: item.assigned_manager_name,
      imageUrl: item.image_url,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      resolvedAt: item.resolved_at,
    }));
  } catch (error) {
    console.error('Failed to get complaints:', error);
    return [];
  }
}

export async function saveComplaint(complaint: Complaint): Promise<void> {
  try {
    const supabase = getSharedSupabaseClient();
    const dbComplaint = {
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      location: complaint.location,
      priority: complaint.priority,
      status: complaint.status,
      reporter_id: complaint.reporterId,
      reporter_name: complaint.reporterName,
      assigned_manager_id: complaint.assignedManagerId,
      assigned_manager_name: complaint.assignedManagerName,
      image_url: complaint.imageUrl,
      created_at: complaint.createdAt,
      updated_at: complaint.updatedAt,
      resolved_at: complaint.resolvedAt,
    };

    const { error } = await supabase
      .from('complaints')
      .upsert(dbComplaint);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to save complaint:', error);
    throw error;
  }
}

export async function getComplaintUpdates(complaintId: string): Promise<ComplaintUpdate[]> {
  try {
    const supabase = getSharedSupabaseClient();
    const { data, error } = await supabase
      .from('complaint_updates')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      complaintId: item.complaint_id,
      status: item.status,
      note: item.note,
      updatedBy: item.updated_by,
      updatedByName: item.updated_by_name,
      createdAt: item.created_at,
    }));
  } catch (error) {
    console.error('Failed to get complaint updates:', error);
    return [];
  }
}

export async function saveComplaintUpdate(update: ComplaintUpdate): Promise<void> {
  try {
    const supabase = getSharedSupabaseClient();
    const dbUpdate = {
      id: update.id,
      complaint_id: update.complaintId,
      status: update.status,
      note: update.note,
      updated_by: update.updatedBy,
      updated_by_name: update.updatedByName,
      created_at: update.createdAt,
    };

    const { error } = await supabase
      .from('complaint_updates')
      .insert(dbUpdate);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to save complaint update:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const supabase = getSharedSupabaseClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*');

    if (error) throw error;

    return (data || []).map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      employeeId: profile.employee_id,
      department: profile.department,
    }));
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}
