/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Course {
  id: string;
  name: string;
  credits: number;
  prerequisites: string[]; // IDs of courses
  department: string;
}

export interface Professor {
  id: string;
  name: string;
  specialties: string[]; // Course IDs they can teach
  availability: TimeSlot[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'theory' | 'lab';
}

export interface Student {
  id: string;
  name: string;
  enrolledCourses: string[];
  completedCourses: string[];
  maxCredits: number;
}

export interface TimeSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startHour: number; // 24h format
  duration: number; // in hours
}

export interface ScheduledCourse {
  courseId: string;
  professorId: string;
  roomId: string;
  timeSlot: TimeSlot;
}

export interface Schedule {
  id: string;
  name: string;
  assignments: ScheduledCourse[];
  fitnessScore: number;
  createdAt: string;
}
