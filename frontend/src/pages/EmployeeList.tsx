import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVacation } from '../context/VacationContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Plus, Edit, Trash, ChevronDown, Users } from 'lucide-react';

const EmployeeList: React.FC = () => {
  const { users, deleteUser } = useVacation();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  
  // Get unique departments
  const departments = Array.from(new Set(users.map(user => user.department)));
  
  // Filter users based on search term and department
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === '' || user.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="mt-2 text-lg text-gray-500">
            Gerencie os funcionários cadastrados no sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/employees/new">
            <Button 
              variant="primary" 
              size="lg"
              leftIcon={<Plus size={20} />}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Novo Funcionário
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader className="bg-primary-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="h-12 bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="h-12 bg-white border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">Todos os departamentos</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-lg font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg text-gray-900">{user.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                        {user.role === 'manager' ? 'Gestor' : 'Funcionário'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link to={`/employees/${user.id}`}>
                            <Button 
                              variant="light" 
                              size="lg"
                              leftIcon={<Edit size={20} />}
                            >
                              Editar
                            </Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            size="lg"
                            leftIcon={<Trash size={20} />}
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
                                deleteUser(user.id);
                              }
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum funcionário encontrado</h3>
              <p className="mt-1 text-lg text-gray-500">
                {users.length === 0 
                  ? 'Comece adicionando um novo funcionário ao sistema.' 
                  : 'Nenhum resultado encontrado para os filtros aplicados.'}
              </p>
              {users.length === 0 && (
                <div className="mt-6">
                  <Link to="/employees/new">
                    <Button 
                      variant="primary" 
                      size="lg"
                      leftIcon={<Plus size={20} />}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Novo Funcionário
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EmployeeList;