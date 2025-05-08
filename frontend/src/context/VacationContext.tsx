import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, VacationPeriod, SystemConfig, VacationContextType } from '../types';
import { useAuth } from './AuthContext';

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export function VacationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [vacationPeriods, setVacationPeriods] = useState<VacationPeriod[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    vacationDaysPerYear: 30,
    minVacationDays: 5,
    maxVacationDays: 30,
    notificationEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchVacationPeriods();
      fetchSystemConfig();
    }
  }, [user]);

  const fetchVacationPeriods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vacation_periods')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setVacationPeriods(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error('Erro ao buscar períodos de férias:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setSystemConfig(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar configurações do sistema:', error);
    }
  };

  const createVacationPeriod = async (period: Omit<VacationPeriod, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vacation_periods')
        .insert([period]);

      if (error) throw error;
      await fetchVacationPeriods();
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVacationPeriod = async (id: string, status: VacationPeriod['status']) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vacation_periods')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchVacationPeriods();
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteVacationPeriod = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('vacation_periods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchVacationPeriods();
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSystemConfig = async (config: Partial<SystemConfig>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('system_config')
        .update(config)
        .eq('id', 1);

      if (error) throw error;
      await fetchSystemConfig();
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <VacationContext.Provider
      value={{
        user,
        vacationPeriods,
        systemConfig,
        loading,
        error,
        createVacationPeriod,
        updateVacationPeriod,
        deleteVacationPeriod,
        updateSystemConfig,
      }}
    >
      {children}
    </VacationContext.Provider>
  );
}

export function useVacation() {
  const context = useContext(VacationContext);
  if (context === undefined) {
    throw new Error('useVacation deve ser usado dentro de um VacationProvider');
  }
  return context;
}