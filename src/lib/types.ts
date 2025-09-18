export type Task = {
  id: string;
  name: string;
  dateTime?: Date;
  estimatedEffort: string;
  isCompleted: boolean;
  reminderMinutes?: number;
  hasOverlap?: boolean;
};
