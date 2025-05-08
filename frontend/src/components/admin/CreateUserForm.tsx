import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description: string;
}

type Position = 'employee' | 'manager';
type Role = 'user' | 'admin';

export function CreateUserForm() {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department_id: '',
    position: 'employee' as Position,
    role: 'user' as Role
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      toast.error('Erro ao carregar departamentos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        email_confirm: true,
        user_metadata: {
          name: formData.name,
          department_id: formData.department_id,
          position: formData.position,
          role: formData.role
        }
      });

      if (authError) throw authError;

      // 2. Criar registro na tabela users
      const { error: userError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          department_id: formData.department_id,
          position: formData.position,
          role: formData.role
        }
      ]);

      if (userError) throw userError;

      toast.success('Usuário criado com sucesso');
      setFormData({
        email: '',
        name: '',
        department_id: '',
        position: 'employee',
        role: 'user'
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <select
          id="department"
          value={formData.department_id}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setFormData({ ...formData, department_id: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="">Selecione um departamento</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Cargo</Label>
        <select
          id="position"
          value={formData.position}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setFormData({ ...formData, position: e.target.value as Position })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="employee">Funcionário</option>
          <option value="manager">Gerente</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            setFormData({ ...formData, role: e.target.value as Role })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="user">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Usuário'}
      </Button>
    </form>
  );
} 