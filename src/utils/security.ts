/**
 * Utility functions for securing client inputs and preventing HTML injections or malicious exploits.
 */

/**
 * Sanitizes user text input by stripping out HTML tags and escaping dangerous characters.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // 1. Strip standard HTML/script tags
  let cleaned = input.replace(/<[^>]*>/g, '');
  
  // 2. Escape basic characters to prevent any inline render hijacking
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // 3. Trim outer spacing
  return cleaned.trim();
}

/**
 * Validates that an input is within a safe length to prevent UI exploits.
 */
export function validateInput(input: string, maxLength: number = 200): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength;
}
