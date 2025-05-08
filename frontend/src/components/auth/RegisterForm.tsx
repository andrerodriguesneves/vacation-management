import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description: string;
}

type Position = 'employee' | 'manager';

export function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department_id: '',
    position: 'employee' as Position
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            department_id: formData.department_id,
            position: formData.position
          }
        }
      });

      if (authError) throw authError;

      // 2. Criar registro na tabela users
      if (authData.user) {
        const { error: userError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            department_id: formData.department_id,
            position: formData.position,
            role: 'user'
          }
        ]);

        if (userError) throw userError;
      }

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar o cadastro.');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta');
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Departamento</Label>
        <select
          id="department"
          value={formData.department_id}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, department_id: e.target.value })}
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, position: e.target.value as Position })}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="employee">Funcionário</option>
          <option value="manager">Gerente</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
} 