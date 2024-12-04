import { Change } from "@/zod-schemas/changes";

export function generateChanges<
  T extends Record<string, string | number | boolean | Date | null>
>(existing: T, updated: T, fields: (keyof T)[]): Change[] {
  return fields.reduce<Change[]>((changes, field) => {
    console.log("in trackChanges : field", field);
    console.log("in trackChanges : existing[field]", existing[field]);
    console.log("in trackChanges : updated[field]", updated[field]);

    const existingValue = existing[field]?.toString() ?? null;
    const updatedValue = updated[field]?.toString() ?? null;

    // Compare values and push changes
    if (existingValue !== updatedValue) {
      changes.push({
        field: field as string, // Explicitly cast field to string
        oldValue: existingValue,
        newValue: updatedValue,
      } as Change); // Ensure the object conforms to Change
    }
    return changes;
  }, []);
}
