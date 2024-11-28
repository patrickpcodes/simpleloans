export interface HistoryChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface History {
  id: string;
  type: string;
  referenceId: string;
  changes: HistoryChange[];
  userId: string;
  displayName: string;
  timestamp: string;
}
