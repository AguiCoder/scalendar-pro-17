
import { Shift } from "@/components/ShiftCard";
import { addDays, format } from "date-fns";

// This function will be called to get translated shifts
export function generateMockShifts(t: (key: string) => string, startDate: Date, numberOfDays: number = 30): Shift[] {
  const shifts: Shift[] = [];
  
  // Generate mock shift data with translations
  const doctors = [
    t('mocks.doctors.sarahJohnson'),
    t('mocks.doctors.michaelChen'), 
    t('mocks.doctors.emilyRodriguez'),
    t('mocks.doctors.davidKim'),
    t('mocks.doctors.lisaThompson'),
  ];

  const departments = [
    t('mocks.departments.emergencyMedicine'),
    t('mocks.departments.cardiology'), 
    t('mocks.departments.neurology'),
    t('mocks.departments.pediatrics'),
    t('mocks.departments.radiology'),
  ];

  const shiftTypes: Shift["shiftType"][] = [
    t('mocks.shiftTypes.dayShift') as Shift["shiftType"], 
    t('mocks.shiftTypes.nightShift') as Shift["shiftType"], 
    t('mocks.shiftTypes.weekend') as Shift["shiftType"], 
    t('mocks.shiftTypes.holiday') as Shift["shiftType"]
  ];
  const statuses: Shift["status"][] = ["confirmed", "available", "negotiation"];
  
  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = addDays(startDate, i);
    const numberOfShifts = Math.floor(Math.random() * 3) + 1; // 1-3 shifts per day
    
    for (let j = 0; j < numberOfShifts; j++) {
      const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
      const isNightShift = shiftType === t('mocks.shiftTypes.nightShift');
      
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
        location: t('mocks.locations.floor1'), // Using translated location
      };
      
      shifts.push(shift);
    }
  }
  
  return shifts;
}

// Keep the old export for backward compatibility
export const mockShifts = generateMockShifts(() => '', new Date(), 30);
