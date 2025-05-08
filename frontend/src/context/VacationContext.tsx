import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, VacationPeriod, SystemConfig, VacationContext as VacationContextType } from '../types';
import { generateId } from '../utils/helpers';

const VacationContext = createContext<VacationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  USERS: 'vacation-app-users',
  VACATION_PERIODS: 'vacation-app-vacation-periods',
  SYSTEM_CONFIG: 'vacation-app-system-config',
};

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    return storedUsers 
      ? JSON.parse(storedUsers).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
        })) 
      : [];
  });

  const [vacationPeriods, setVacationPeriods] = useState<VacationPeriod[]>(() => {
    const storedPeriods = localStorage.getItem(LOCAL_STORAGE_KEYS.VACATION_PERIODS);
    return storedPeriods 
      ? JSON.parse(storedPeriods).map((period: any) => ({
          ...period,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
          createdAt: new Date(period.createdAt),
          updatedAt: new Date(period.updatedAt),
        })) 
      : [];
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEYS.SYSTEM_CONFIG);
    return storedConfig 
      ? JSON.parse(storedConfig)
      : {
          currentYear: new Date().getFullYear(),
          notificationEmail: '',
        };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VACATION_PERIODS, JSON.stringify(vacationPeriods));
  }, [vacationPeriods]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SYSTEM_CONFIG, JSON.stringify(systemConfig));
  }, [systemConfig]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === id ? { ...user, ...data } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setVacationPeriods((prevPeriods) => 
      prevPeriods.filter((period) => period.userId !== id)
    );
  };

  const addVacationPeriod = (periodData: Omit<VacationPeriod, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newPeriod: VacationPeriod = {
      ...periodData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setVacationPeriods((prevPeriods) => [...prevPeriods, newPeriod]);
  };

  const updateVacationPeriod = (id: string, data: Partial<VacationPeriod>) => {
    setVacationPeriods((prevPeriods) =>
      prevPeriods.map((period) =>
        period.id === id
          ? { ...period, ...data, updatedAt: new Date() }
          : period
      )
    );
  };

  const deleteVacationPeriod = (id: string) => {
    setVacationPeriods((prevPeriods) => 
      prevPeriods.filter((period) => period.id !== id)
    );
  };

  const updateVacationStatus = async (id: string, status: VacationPeriod['status'], notes?: string) => {
    const period = vacationPeriods.find(p => p.id === id);
    if (!period) return;

    const employee = users.find(u => u.id === period.userId);
    if (!employee) return;

    setVacationPeriods((prevPeriods) =>
      prevPeriods.map((period) =>
        period.id === id
          ? { 
              ...period, 
              status, 
              notes: notes || period.notes, 
              updatedAt: new Date() 
            }
          : period
      )
    );

    if (status === 'approved' && systemConfig.notificationEmail) {
      try {
        // In a real app, this would send emails through a backend service
        console.log('Sending approval notification emails to:', {
          to: employee.email,
          cc: systemConfig.notificationEmail,
          subject: 'Férias Aprovadas',
          message: `Suas férias foram aprovadas para o período de ${period.startDate.toLocaleDateString()} a ${period.endDate.toLocaleDateString()}`
        });
      } catch (error) {
        console.error('Failed to send notification emails:', error);
      }
    }
  };

  const updateSystemConfig = (config: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...config }));
  };

  return (
    <VacationContext.Provider
      value={{
        users,
        vacationPeriods,
        systemConfig,
        addUser,
        updateUser,
        deleteUser,
        addVacationPeriod,
        updateVacationPeriod,
        deleteVacationPeriod,
        updateVacationStatus,
        updateSystemConfig,
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export const useVacation = () => {
  const context = useContext(VacationContext);
  if (context === undefined) {
    throw new Error('useVacation must be used within a VacationProvider');
  }
  return context;
};