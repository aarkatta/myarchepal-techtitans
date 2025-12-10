import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely converts various date formats to a JavaScript Date object.
 * Handles Firebase Timestamps, serialized Timestamps from cache, Date objects, strings, and numbers.
 * @param date - The date value to parse
 * @returns A valid Date object or null if the date cannot be parsed
 */
export function parseDate(date: Date | Timestamp | undefined | null | any): Date | null {
  if (!date) return null;

  let d: Date;

  // Handle Timestamp instance
  if (date instanceof Timestamp) {
    d = date.toDate();
  }
  // Handle serialized Timestamp object from cache (has seconds and nanoseconds)
  else if (date && typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  }
  // Handle Date instance
  else if (date instanceof Date) {
    d = date;
  }
  // Handle string date
  else if (typeof date === 'string') {
    d = new Date(date);
  }
  // Handle number (timestamp in ms)
  else if (typeof date === 'number') {
    d = new Date(date);
  }
  else {
    return null;
  }

  // Validate the date
  if (isNaN(d.getTime())) {
    return null;
  }

  return d;
}
