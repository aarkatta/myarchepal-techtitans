/**
 * Security Utilities for Sanitizing User Input
 *
 * This module provides functions to prevent XSS attacks and other security vulnerabilities
 */

/**
 * Sanitize emoji input to prevent XSS attacks
 * Only allows actual emoji characters, blocks any HTML or script tags
 *
 * @param input - The emoji string to sanitize
 * @param fallback - Fallback emoji if input is invalid (default: '📄')
 * @returns Sanitized emoji string
 */
export function sanitizeEmoji(input: string | undefined, fallback: string = '📄'): string {
  if (!input || typeof input !== 'string') {
    return fallback;
  }

  // Remove any HTML tags
  const withoutHtml = input.replace(/<[^>]*>/g, '');

  // Only allow emoji characters and basic text
  // This regex allows emojis, numbers, letters, and common punctuation
  const emojiRegex = /[\p{Emoji}\p{L}\p{N}\s]/gu;
  const matches = withoutHtml.match(emojiRegex);

  if (!matches || matches.length === 0) {
    return fallback;
  }

  // Take only the first few characters to prevent abuse
  const sanitized = matches.join('').slice(0, 10).trim();

  return sanitized || fallback;
}

/**
 * Sanitize text content to prevent XSS
 * Removes HTML tags and potentially dangerous characters
 *
 * @param input - The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(input: string | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  const withoutHtml = input.replace(/<[^>]*>/g, '');

  // Remove potential script-like content
  const sanitized = withoutHtml
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  return sanitized;
}

/**
 * Safely create a fallback element when image loading fails
 * This is a safer alternative to using innerHTML
 *
 * @param emoji - The emoji to display
 * @param size - The CSS class for size (default: 'text-2xl')
 * @returns HTMLSpanElement with the emoji
 */
export function createEmojiElement(emoji: string, size: string = 'text-2xl'): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = size;
  span.textContent = sanitizeEmoji(emoji);
  return span;
}

/**
 * Validate URL to prevent javascript: and data: URI attacks
 *
 * @param url - The URL to validate
 * @returns True if URL is safe, false otherwise
 */
export function isValidUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const lowerUrl = url.toLowerCase().trim();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
    return false;
  }

  // Allow http, https, and relative URLs
  return lowerUrl.startsWith('http://') ||
         lowerUrl.startsWith('https://') ||
         lowerUrl.startsWith('/') ||
         lowerUrl.startsWith('./') ||
         lowerUrl.startsWith('../');
}

/**
 * Get emoji for artifact type
 *
 * @param type - The artifact type
 * @returns Emoji representing the artifact type
 */
export function getArtifactEmoji(type: string | undefined): string {
  switch (type) {
    case 'Coin':
      return '🪙';
    case 'Ceramic':
      return '🏺';
    case 'Weapon':
      return '🗡️';
    case 'Glass':
      return '🍶';
    case 'Personal Ornament':
      return '📎';
    case 'Sculpture':
      return '🗿';
    default:
      return '🏺';
  }
}
