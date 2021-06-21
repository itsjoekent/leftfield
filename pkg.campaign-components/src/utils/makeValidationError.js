export const FAIL_SEVERITY = 'FAIL_SEVERITY';
export const WARNING_SEVERITY = 'WARNING_SEVERITY';

export default function makeValidationError(message, severity = FAIL_SEVERITY) {
  const error = new Error(message);
  error.severity = severity;
  return error;
}
