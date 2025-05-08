import React, { useState } from 'react';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDate, getCurrentYear } from '../utils/helpers';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const { users, vacationPeriods } = useVacation();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Previous month days to display
  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    const prevMonthDate = new Date(currentYear, currentMonth, 0 - i);
    prevMonthDays.unshift(prevMonthDate.getDate());
  }
  
  // Next month days to display
  const totalDaysToShow = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
  const nextMonthDays = [];
  for (let i = 1; i <= totalDaysToShow - daysInMonth - firstDayOfMonth; i++) {
    nextMonthDays.push(i);
  }
  
  // Current month days
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i);
  }
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Get vacation periods for a specific day
  const getVacationPeriodsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    
    return vacationPeriods.filter(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return date >= startDate && date <= endDate;
    });
  };
  
  // Format month name
  const getMonthName = (month: number) => {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[month];
  };
  
  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendário de Férias</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visualize os períodos de férias agendados para a equipe
        </p>
      </div>
      
      <Card>
        <CardHeader className="flex items-center justify-between bg-gray-50 py-6">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-medium text-gray-900">
              {getMonthName(currentMonth)} {currentYear}
            </h2>
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardBody className="p-0">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Days of week */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div 
                key={day} 
                className="bg-gray-50 text-center py-2 font-medium text-gray-500 text-sm"
              >
                {day}
              </div>
            ))}
            
            {/* Previous month days */}
            {prevMonthDays.map((day, index) => (
              <div 
                key={`prev-${index}`} 
                className="bg-white h-24 sm:h-32 p-2 text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
            
            {/* Current month days */}
            {currentMonthDays.map(day => {
              const vacationsForDay = getVacationPeriodsForDay(day);
              
              return (
                <div 
                  key={`current-${day}`} 
                  className={`bg-white min-h-24 sm:min-h-32 p-2 text-sm ${
                    isToday(day) ? 'ring-2 ring-blue-500 ring-inset' : ''
                  }`}
                >
                  <div className={`
                    inline-flex justify-center items-center rounded-full w-6 h-6
                    ${isToday(day) ? 'bg-blue-500 text-white' : 'text-gray-700'}
                  `}>
                    {day}
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-20 sm:max-h-28 overflow-y-auto">
                    {vacationsForDay.map(vacation => {
                      const employee = users.find(u => u.id === vacation.userId);
                      
                      const getStatusColor = () => {
                        switch (vacation.status) {
                          case 'approved':
                            return 'success';
                          case 'pending':
                            return 'warning';
                          case 'rejected':
                            return 'danger';
                          default:
                            return 'default';
                        }
                      };
                      
                      return (
                        <div 
                          key={vacation.id} 
                          className="px-2 py-1 text-xs rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium truncate">
                            {employee?.name || 'Funcionário'}
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-gray-500 text-xs">
                              {vacation.duration} dias
                            </span>
                            <Badge variant={getStatusColor()} className="text-xs py-0 px-1.5">
                              {vacation.status === 'approved' ? 'A' : vacation.status === 'pending' ? 'P' : 'R'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {/* Next month days */}
            {nextMonthDays.map((day, index) => (
              <div 
                key={`next-${index}`} 
                className="bg-white h-24 sm:h-32 p-2 text-gray-400 text-sm"
              >
                {day}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      
      <Card>
        <CardHeader className="bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Legenda</h3>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <Badge variant="success" className="mr-2">A</Badge>
            <span className="text-sm">Aprovado</span>
          </div>
          <div className="flex items-center">
            <Badge variant="warning" className="mr-2">P</Badge>
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center">
            <Badge variant="danger" className="mr-2">R</Badge>
            <span className="text-sm">Rejeitado</span>
          </div>
          <div className="flex items-center ml-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
              1
            </div>
            <span className="text-sm">Data atual</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Calendar;