export const FAIL_SEVERITY = 'FAIL_SEVERITY';
export const WARNING_SEVERITY = 'WARNING_SEVERITY';

export default function makeValidationError(message, severity = FAIL_SEVERITY) {
  return {
    message,
    severity,
  }
}
