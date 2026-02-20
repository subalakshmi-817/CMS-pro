import { createContext, useState, useEffect, ReactNode } from 'react';
import { Complaint, ComplaintUpdate } from '@/types';
import * as storage from '@/services/storage';
import { ComplaintStatus, ComplaintPriority } from '@/constants/config';

interface ComplaintContextType {
  complaints: Complaint[];
  loading: boolean;
  refreshComplaints: () => Promise<void>;
  createComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  addComplaintUpdate: (update: Omit<ComplaintUpdate, 'id' | 'createdAt'>) => Promise<void>;
  getComplaintUpdates: (complaintId: string) => Promise<ComplaintUpdate[]>;
}

export const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      const data = await storage.getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshComplaints() {
    await loadComplaints();
  }

  async function createComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) {
    const newComplaint: Complaint = {
      ...complaint,
      id: `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.saveComplaint(newComplaint);
    await refreshComplaints();
  }

  async function updateComplaint(id: string, updates: Partial<Complaint>) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    const updatedComplaint: Complaint = {
      ...complaint,
      ...updates,
      updatedAt: new Date().toISOString(),
      resolvedAt: updates.status === 'resolved' ? new Date().toISOString() : complaint.resolvedAt,
    };

    await storage.saveComplaint(updatedComplaint);
    await refreshComplaints();
  }

  async function addComplaintUpdate(update: Omit<ComplaintUpdate, 'id' | 'createdAt'>) {
    const newUpdate: ComplaintUpdate = {
      ...update,
      id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    await storage.saveComplaintUpdate(newUpdate);
  }

  async function getComplaintUpdates(complaintId: string): Promise<ComplaintUpdate[]> {
    return await storage.getComplaintUpdates(complaintId);
  }

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        refreshComplaints,
        createComplaint,
        updateComplaint,
        addComplaintUpdate,
        getComplaintUpdates,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}
