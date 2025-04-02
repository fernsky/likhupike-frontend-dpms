export interface UserValidationError {
  message: string;
  field?: string;
  code?: string;
  // Changed from Record<string, any> to unknown to match the other interface
  details?: unknown;

  // Allow string representation
  toString(): string;
}
