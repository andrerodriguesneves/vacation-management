export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  department?: string;
  position?: string;
  created_at: string;
}

export interface VacationPeriod {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SystemConfig {
  vacationDaysPerYear: number;
  minVacationDays: number;
  maxVacationDays: number;
  notificationEmail: string;
}

export interface VacationContextType {
  user: User | null;
  vacationPeriods: VacationPeriod[];
  systemConfig: SystemConfig;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createVacationPeriod: (period: Omit<VacationPeriod, 'id' | 'created_at'>) => Promise<void>;
  updateVacationPeriod: (id: string, status: VacationPeriod['status']) => Promise<void>;
  deleteVacationPeriod: (id: string) => Promise<void>;
  updateSystemConfig: (config: Partial<SystemConfig>) => Promise<void>;
}