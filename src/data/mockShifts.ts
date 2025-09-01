
import { Shift } from "@/components/ShiftCard";
import { addDays, format } from "date-fns";

// Generate mock shift data
const doctors = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen", 
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Thompson",
];

const departments = [
  "Emergency Medicine",
  "Cardiology", 
  "Neurology",
  "Pediatrics",
  "Radiology",
];

const shiftTypes: Shift["shiftType"][] = ["Day Shift", "Night Shift", "Weekend", "Holiday"];
const statuses: Shift["status"][] = ["confirmed", "available", "negotiation"];

export function generateMockShifts(startDate: Date, numberOfDays: number = 30): Shift[] {
  const shifts: Shift[] = [];
  
  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = addDays(startDate, i);
    const numberOfShifts = Math.floor(Math.random() * 3) + 1; // 1-3 shifts per day
    
    for (let j = 0; j < numberOfShifts; j++) {
      const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
      const isNightShift = shiftType === "Night Shift";
      
      // Some shifts are intentionally unassigned (available)
      const isAssigned = Math.random() > 0.2; // 80% chance of being assigned
      
      const shift: Shift = {
        id: `shift-${i}-${j}`,
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: isNightShift ? "19:00" : j === 0 ? "08:00" : "14:00",
        endTime: isNightShift ? "07:00" : j === 0 ? "14:00" : "20:00", 
        doctorName: isAssigned ? doctors[Math.floor(Math.random() * doctors.length)] : undefined,
        department: departments[Math.floor(Math.random() * departments.length)],
        shiftType,
        status: isAssigned ? statuses[Math.floor(Math.random() * statuses.length)] : "available",
        location: `Floor ${Math.floor(Math.random() * 5) + 1}`,
      };
      
      shifts.push(shift);
    }
  }
  
  return shifts;
}

export const mockShifts = generateMockShifts(new Date(), 30);
