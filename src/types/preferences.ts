export interface TimeRange {
  id: string;
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface DayAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isAvailable: boolean;
  timeRanges: TimeRange[];
}

export interface Vacation {
  id: string;
  startDate: Date;
  endDate: Date;
  description: string;
  type: 'vacation' | 'sick_leave' | 'personal' | 'conference';
}

export interface Restriction {
  id: string;
  type: 'max_consecutive_nights' | 'min_weekends_off' | 'max_hours_per_week' | 'no_back_to_back_shifts' | 'custom';
  title: string;
  description: string;
  value: number | string;
  isActive: boolean;
}

export interface WeightedPreference {
  id: string;
  category: 'time_preference' | 'shift_type' | 'department' | 'colleague' | 'custom';
  title: string;
  description: string;
  weight: number; // 0-10 scale
  isActive: boolean;
}

export interface DoctorPreferences {
  availability: DayAvailability[];
  vacations: Vacation[];
  restrictions: Restriction[];
  weightedPreferences: WeightedPreference[];
}