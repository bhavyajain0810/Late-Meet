/**
 * @fileoverview Centralized XSS sanitization utilities
 * @security All dynamic data rendered via innerHTML MUST use these functions
 */

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Use for ALL untrusted data before innerHTML insertion.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

/**
 * Validates and sanitizes CSS class names
 * Prevents class injection attacks
 */
export function sanitizeClassName(value: unknown, allowed: string[]): string {
  const str = String(value || "");
  return allowed.includes(str) ? str : allowed[0];
}

/**
 * Sanitizes data-* attribute values
 * Prevents attribute injection
 */
export function sanitizeDataAttr(value: unknown): string {
  return String(value || "").replace(/['"<>&]/g, "");
}
