import { CallLogEntry, MessageEntry } from '@/native/CommunicationModule';

export type CallFilter = 'all' | 'incoming' | 'outgoing' | 'missed' | 'unknown';
export type MessageFilter = 'all' | 'sent' | 'received' | 'unknown';
export type SortOrder = 'asc' | 'desc';
export type TimeRange = 'today' | 'week' | 'month' | 'all';

export const filterCalls = (
  calls: CallLogEntry[],
  filter: CallFilter,
  timeRange: TimeRange,
  searchQuery: string = ''
): CallLogEntry[] => {
  const now = new Date();
  const startDate = getStartDate(timeRange);

  return calls.filter((call) => {
    const matchesFilter = filter === 'all' || call.type === filter;
    const matchesTimeRange = startDate 
      ? new Date(call.timestamp) >= startDate
      : true;
    const matchesSearch = searchQuery
      ? call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        call.number.includes(searchQuery)
      : true;

    return matchesFilter && matchesTimeRange && matchesSearch;
  });
};

export const filterMessages = (
  messages: MessageEntry[],
  filter: MessageFilter,
  timeRange: TimeRange,
  searchQuery: string = ''
): MessageEntry[] => {
  const startDate = getStartDate(timeRange);

  return messages.filter((message) => {
    const matchesFilter = filter === 'all' || message.type === filter;
    const matchesTimeRange = startDate 
      ? new Date(message.timestamp) >= startDate
      : true;
    const matchesSearch = searchQuery
      ? message.number.includes(searchQuery) ||
        message.preview.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesFilter && matchesTimeRange && matchesSearch;
  });
};

export const sortCommunicationItems = <T extends { timestamp: string }>(
  items: T[],
  order: SortOrder = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

const getStartDate = (timeRange: TimeRange): Date | null => {
  const now = new Date();
  switch (timeRange) {
    case 'today':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    case 'month':
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    case 'all':
      return null;
    default:
      return null;
  }
};

const CommunicationFilters = {
  filterCalls,
  filterMessages,
  sortCommunicationItems,
  getStartDate,
};

export default CommunicationFilters;
