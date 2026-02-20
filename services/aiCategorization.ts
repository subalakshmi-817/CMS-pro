import { ComplaintCategory, ComplaintPriority } from '@/constants/config';

interface AISuggestion {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  confidence: number;
}

const CATEGORY_KEYWORDS: Record<ComplaintCategory, string[]> = {
  wifi: ['wifi', 'internet', 'network', 'connection', 'connectivity', 'online', 'bandwidth', 'router'],
  lab: ['lab', 'system', 'computer', 'pc', 'desktop', 'monitor', 'keyboard', 'mouse', 'software'],
  hostel: ['hostel', 'room', 'fan', 'light', 'bed', 'mattress', 'washroom', 'bathroom', 'mess'],
  electrical: ['electric', 'power', 'electricity', 'voltage', 'switch', 'socket', 'wiring', 'blackout'],
  infrastructure: ['building', 'wall', 'ceiling', 'floor', 'door', 'window', 'paint', 'construction'],
  library: ['library', 'book', 'reading', 'seating', 'ac', 'silence'],
  others: [],
};

const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'emergency', 'broken', 'damage', 'safety', 'danger', 'fire', 'leak', 'complete', 'full', 'outage', 'critical'
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'issue', 'problem', 'not working', 'malfunction', 'need', 'repair', 'fix'
];

export function categorizeComplaint(title: string, description: string): AISuggestion {
  const text = `${title} ${description}`.toLowerCase();
  
  // Detect category
  let detectedCategory: ComplaintCategory = 'others';
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'others') continue;
    
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = category as ComplaintCategory;
    }
  }
  
  // Detect priority
  let priority: ComplaintPriority = 'low';
  
  const hasHighPriorityKeyword = HIGH_PRIORITY_KEYWORDS.some(keyword => text.includes(keyword));
  const hasMediumPriorityKeyword = MEDIUM_PRIORITY_KEYWORDS.some(keyword => text.includes(keyword));
  
  if (hasHighPriorityKeyword) {
    priority = 'high';
  } else if (hasMediumPriorityKeyword || maxMatches >= 2) {
    priority = 'medium';
  }
  
  // Calculate confidence
  const confidence = maxMatches > 0 ? Math.min(0.95, 0.6 + (maxMatches * 0.1)) : 0.4;
  
  return {
    category: detectedCategory,
    priority,
    confidence,
  };
}
