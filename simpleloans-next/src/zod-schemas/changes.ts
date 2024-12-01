export interface Change {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}
export type Changes = Change[];
