import { Course, Professor, Room, TimeSlot, ScheduledCourse, Schedule } from '../types';

/**
 * Basic CSP Solver for Schedule Generation
 */
export class SchedulerEngine {
  private courses: Course[];
  private professors: Professor[];
  private rooms: Room[];
  private days: TimeSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  private hours = [7, 9, 11, 14, 16, 18]; // Standard block starts

  constructor(courses: Course[], professors: Professor[], rooms: Room[]) {
    this.courses = courses;
    this.professors = professors;
    this.rooms = rooms;
  }

  public generateSchedule(name: string): Schedule {
    const assignments: ScheduledCourse[] = [];
    const usedSlots = new Set<string>(); // "day-hour-room" or "day-hour-prof"

    // Heuristic: Process courses one by one
    for (const course of this.courses) {
      const eligibleProfs = this.professors.filter(p => p.specialties.includes(course.id));
      
      let assigned = false;
      
      // Shuffle lists for variability
      const shuffledProfs = [...eligibleProfs].sort(() => Math.random() - 0.5);
      const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);

      for (const prof of shuffledProfs) {
        if (assigned) break;

        for (const day of this.days) {
          if (assigned) break;

          for (const hour of this.hours) {
            if (assigned) break;

            // Check prof availability (mock check: always available for this example, 
            // but in real app we'd check prof.availability)
            
            for (const room of shuffledRooms) {
              const roomSlotKey = `${day}-${hour}-${room.id}`;
              const profSlotKey = `${day}-${hour}-${prof.id}`;

              if (!usedSlots.has(roomSlotKey) && !usedSlots.has(profSlotKey)) {
                assignments.push({
                  courseId: course.id,
                  professorId: prof.id,
                  roomId: room.id,
                  timeSlot: { day, startHour: hour, duration: 2 }
                });

                usedSlots.add(roomSlotKey);
                usedSlots.add(profSlotKey);
                assigned = true;
                break;
              }
            }
          }
        }
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      assignments,
      fitnessScore: (assignments.length / this.courses.length) * 100,
      createdAt: new Date().toISOString()
    };
  }
}
