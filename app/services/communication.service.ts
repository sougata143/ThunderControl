import { ref, push, query, orderByChild, startAt, endAt, get, onValue, off } from 'firebase/database';
import { db } from '../config/firebase';

export interface CallRecord {
  phoneNumber: string;
  callType: 'incoming' | 'outgoing' | 'missed';
  duration: number;
  timestamp: number;
  contactName?: string;
}

export interface MessageRecord {
  phoneNumber: string;
  messageType: 'sent' | 'received';
  timestamp: number;
  contactName?: string;
  messagePreview?: string;
}

class CommunicationService {
  static async logCallRecord(userId: string, record: CallRecord): Promise<void> {
    try {
      await push(ref(db, `callHistory/${userId}`), {
        ...record,
        timestamp: record.timestamp || Date.now(),
      });
    } catch (error) {
      console.error('Error logging call record:', error);
      throw error;
    }
  }

  static async logMessageRecord(userId: string, record: MessageRecord): Promise<void> {
    try {
      await push(ref(db, `messageHistory/${userId}`), {
        ...record,
        timestamp: record.timestamp || Date.now(),
      });
    } catch (error) {
      console.error('Error logging message record:', error);
      throw error;
    }
  }

  static async getCallHistory(
    userId: string,
    startTime?: number,
    endTime?: number
  ): Promise<CallRecord[]> {
    try {
      let query = query(ref(db, `callHistory/${userId}`), orderByChild('timestamp'));
      
      if (startTime) {
        query = query(startAt(startTime));
      }
      if (endTime) {
        query = query(endAt(endTime));
      }

      const snapshot = await get(query);
      
      const calls: CallRecord[] = [];
      snapshot.forEach((child) => {
        calls.push(child.val() as CallRecord);
      });
      
      return calls.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching call history:', error);
      throw error;
    }
  }

  static async getMessageHistory(
    userId: string,
    startTime?: number,
    endTime?: number
  ): Promise<MessageRecord[]> {
    try {
      let query = query(ref(db, `messageHistory/${userId}`), orderByChild('timestamp'));
      
      if (startTime) {
        query = query(startAt(startTime));
      }
      if (endTime) {
        query = query(endAt(endTime));
      }

      const snapshot = await get(query);
      
      const messages: MessageRecord[] = [];
      snapshot.forEach((child) => {
        messages.push(child.val() as MessageRecord);
      });
      
      return messages.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching message history:', error);
      throw error;
    }
  }

  static subscribeToCallHistory(
    userId: string,
    callback: (records: CallRecord[]) => void
  ): () => void {
    const ref = ref(db, `callHistory/${userId}`);
    
    onValue(ref, (snapshot) => {
      const records: CallRecord[] = [];
      snapshot.forEach((child) => {
        records.push(child.val() as CallRecord);
      });
      callback(records.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => off(ref);
  }

  static subscribeToMessageHistory(
    userId: string,
    callback: (records: MessageRecord[]) => void
  ): () => void {
    const ref = ref(db, `messageHistory/${userId}`);
    
    onValue(ref, (snapshot) => {
      const records: MessageRecord[] = [];
      snapshot.forEach((child) => {
        records.push(child.val() as MessageRecord);
      });
      callback(records.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => off(ref);
  }

  static async deleteCallRecord(userId: string, recordId: string): Promise<void> {
    try {
      await ref(db, `callHistory/${userId}/${recordId}`).remove();
    } catch (error) {
      console.error('Error deleting call record:', error);
      throw error;
    }
  }

  static async deleteMessageRecord(userId: string, recordId: string): Promise<void> {
    try {
      await ref(db, `messageHistory/${userId}/${recordId}`).remove();
    } catch (error) {
      console.error('Error deleting message record:', error);
      throw error;
    }
  }
}

export default CommunicationService;
