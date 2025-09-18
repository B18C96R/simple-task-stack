import { addMinutes } from 'date-fns';

/**
 * Parses an effort string (e.g., "2 hours", "30 minutes") and returns the duration in minutes.
 * @param effort - The effort string.
 * @returns The duration in minutes.
 */
export function parseEffort(effort: string): number {
  if (!effort) return 0;
  const effortLower = effort.toLowerCase();
  const parts = effortLower.split(' ');
  const value = parseFloat(parts[0]);

  if (isNaN(value)) return 0;

  if (effortLower.includes('hour')) {
    return value * 60;
  }
  if (effortLower.includes('minute')) {
    return value;
  }
  if (effortLower.includes('day')) {
    return value * 24 * 60;
  }

  // Default to minutes if no unit is specified
  return value;
}

/**
 * Calculates the end time of a task.
 * @param start - The start time of the task.
 * @param effort - The estimated effort string.
 * @returns The end time of the task.
 */
export function getEndTime(start: Date, effort: string): Date {
  const durationInMinutes = parseEffort(effort);
  return addMinutes(start, durationInMinutes);
}
