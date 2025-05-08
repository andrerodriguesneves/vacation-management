export type User = {
  id: string;
  name: string;
  department: string;
  email: string;
  role: 'employee' | 'manager';
  createdAt: Date;
};

export type VacationPeriod = {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: 'pending' | 'approved' | 'rejected';
  year: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
};

export type SystemConfig = {
  currentYear: number;
  notificationEmail: string;
};

export type VacationContext = {
  users: User[];
  vacationPeriods: VacationPeriod[];
  systemConfig: SystemConfig;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addVacationPeriod: (period: Omit<VacationPeriod, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVacationPeriod: (id: string, data: Partial<VacationPeriod>) => void;
  deleteVacationPeriod: (id: string) => void;
  updateVacationStatus: (id: string, status: VacationPeriod['status'], notes?: string) => void;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
};