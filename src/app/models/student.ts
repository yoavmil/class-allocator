export interface Student {
  /** Student's full name */
  name: string;

  /** Optional unique identifier (could be numeric or string) */
  id?: string | number;

  gender?: 'male' | 'female' | null;
  /**
   * Map from weight to target student name or ID
   * For example: { 10: "Alice", 5: "Bob" }
   */
  preferences?: { [weight: number]: string };

  /** Optional group ID if part of a predefined group */
  groupId?: string | number;

  /** Optional screen position for visual layout */
  x?: number;
  y?: number;

  /** Optional final class assignment */
  classId?: string | number;
}
