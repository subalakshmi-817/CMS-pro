import { useContext } from 'react';
import { ComplaintContext } from '@/contexts/ComplaintContext';

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintProvider');
  }
  return context;
}
