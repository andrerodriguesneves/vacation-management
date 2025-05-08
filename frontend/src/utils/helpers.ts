import { VacationPeriod } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const getDurationInDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getVacationDaysUsedInYear = (
  periods: VacationPeriod[], 
  userId: string, 
  year: number,
  includeStatusFilter: boolean = false
): number => {
  return periods
    .filter(
      (period) => 
        period.userId === userId && 
        period.year === year && 
        (!includeStatusFilter || period.status === 'approved' || period.status === 'pending')
    )
    .reduce((total, period) => total + period.duration, 0);
};

export const getVacationPeriodsCountInYear = (
  periods: VacationPeriod[], 
  userId: string, 
  year: number,
  includeStatusFilter: boolean = false
): number => {
  return periods.filter(
    (period) => 
      period.userId === userId && 
      period.year === year && 
      (!includeStatusFilter || period.status === 'approved' || period.status === 'pending')
  ).length;
};

export const isValidVacationDuration = (duration: number): boolean => {
  return [5, 10, 15, 30].includes(duration);
};

export const isValidVacationPeriodCombination = (
  existingPeriods: VacationPeriod[],
  newDuration: number,
  userId: string,
  year: number
): { isValid: boolean; message: string } => {
  const periodsCount = getVacationPeriodsCountInYear(existingPeriods, userId, year, true);
  const daysUsed = getVacationDaysUsedInYear(existingPeriods, userId, year, true);
  const totalDaysAfterNewPeriod = daysUsed + newDuration;

  // Check if total days exceeds 30
  if (totalDaysAfterNewPeriod > 30) {
    return { 
      isValid: false, 
      message: `Ultrapassou o limite de 30 dias de férias por ano (usados: ${daysUsed}, solicitados: ${newDuration})` 
    };
  }

  // Check if periods count exceeds 3
  if (periodsCount >= 3) {
    return { 
      isValid: false, 
      message: 'Já foram registrados 3 períodos de férias para este ano' 
    };
  }

  // Valid vacation period combinations
  const validCombinations = [
    [30],           // One period of 30 days
    [15, 15],       // Two periods of 15 days
    [5, 10, 15],    // Three periods with specific durations
    [5, 15, 10],
    [10, 5, 15],
    [10, 15, 5],
    [15, 5, 10],
    [15, 10, 5]
  ];

  // If this is the first period, check if duration is valid
  if (periodsCount === 0) {
    if ([5, 10, 15, 30].includes(newDuration)) {
      return { isValid: true, message: '' };
    }
    return { 
      isValid: false, 
      message: 'Duração inválida. Os períodos devem ser de 5, 10, 15 ou 30 dias' 
    };
  }

  // For subsequent periods, check if the new combination is valid
  const existingDurations = existingPeriods
    .filter(p => p.userId === userId && p.year === year && (p.status === 'approved' || p.status === 'pending'))
    .map(p => p.duration)
    .sort((a, b) => a - b);

  const newCombination = [...existingDurations, newDuration].sort((a, b) => a - b);

  // Check if this combination matches any valid combination
  const isValidCombination = validCombinations.some(combination => {
    if (combination.length < newCombination.length) return false;
    return JSON.stringify(newCombination) === JSON.stringify(combination.slice(0, newCombination.length));
  });

  if (!isValidCombination) {
    return { 
      isValid: false, 
      message: 'Combinação de períodos inválida. As combinações permitidas são: 30 dias, 15+15 dias, ou 5+10+15 dias em qualquer ordem.' 
    };
  }

  return { isValid: true, message: '' };
};