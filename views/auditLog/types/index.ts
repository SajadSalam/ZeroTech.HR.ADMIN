export interface AuditLog {
  id: string;
  entityType: string;        // e.g. "Question"
  entityId: string;
  action: number;            // 1=create, 2=update, 3=delete (depends on your backend)
  oldValues: string;         // JSON string
  newValues: string;         // JSON string
  userId: number;
  username: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;         // ISO date string
  changes: Record<string, { oldValue: any; newValue: any }>;
}

export interface AuditLogFilters {
  entityType: string | null;
  entityId: string | null;
  action: number | null;
  startDate: string | null;
  endDate: string | null;
}