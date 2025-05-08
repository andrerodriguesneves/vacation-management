import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Search, Plus, Edit, Trash, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários do Sistema</h1>
          <p className="mt-2 text-lg text-gray-500">
            Gerencie os usuários e suas permissões
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700"
            onClick={() => navigate('/users/new')}
          >
            Novo Usuário
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

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
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                      Função
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-lg font-medium text-gray-500">
                      Data de Criação
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-lg font-medium text-gray-500">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            {user.email[0].toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg text-gray-900">
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg text-gray-900">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="light"
                            size="lg"
                            leftIcon={<Edit size={20} />}
                            onClick={() => navigate(`/users/${user.id}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="lg"
                            leftIcon={<Trash size={20} />}
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
                                // Handle user deletion
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
              <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum usuário encontrado</h3>
              <p className="mt-1 text-lg text-gray-500">
                Comece adicionando um novo usuário ao sistema.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Plus size={20} />}
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={() => navigate('/users/new')}
                >
                  Novo Usuário
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UserList;