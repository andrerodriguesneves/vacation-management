# Sistema de Gerenciamento de Férias

Este é um sistema completo para gerenciamento de férias, com frontend em React e backend utilizando Supabase.

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

- `frontend/`: Contém a aplicação React com TypeScript
- `backend/`: Contém a configuração do Supabase e funções do backend

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm run install:all
```

## Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Este comando iniciará tanto o frontend quanto o backend em modo de desenvolvimento.

### Frontend

O frontend estará disponível em `http://localhost:5173`

Comandos específicos do frontend:
```bash
npm run frontend:dev    # Inicia o servidor de desenvolvimento
npm run frontend:build  # Cria a build de produção
npm run frontend:preview # Visualiza a build de produção
```

### Backend

O backend utiliza Supabase como plataforma. As configurações do Supabase estão na pasta `backend/supabase`.

## Scripts Disponíveis

- `npm run install:all`: Instala todas as dependências do projeto
- `npm run dev`: Inicia o ambiente de desenvolvimento completo
- `npm run frontend:dev`: Inicia apenas o frontend
- `npm run frontend:build`: Cria a build de produção do frontend
- `npm run frontend:preview`: Visualiza a build de produção do frontend
- `npm run backend:dev`: Inicia o ambiente de desenvolvimento do backend

## Tecnologias Utilizadas

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Router
  - Supabase Client

- Backend:
  - Supabase
  - PostgreSQL
  - Edge Functions

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- TailwindCSS
- Supabase
- React Router DOM
- React Calendar

## 🛠️ Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Configure as seguintes tabelas:

### Tabela: users
```sql
create table users (
  id uuid references auth.users on delete cascade,
  name text,
  email text unique,
  department text,
  role text check (role in ('user', 'admin')),
  position text check (position in ('employee', 'manager')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security)
alter table users enable row level security;

-- Políticas de segurança
create policy "Usuários podem ver seus próprios dados"
  on users for select
  using (auth.uid() = id);

create policy "Administradores podem ver todos os usuários"
  on users for select
  using (auth.role() = 'authenticated' and exists (
    select 1 from users where id = auth.uid() and role = 'admin'
  ));
```

### Tabela: vacation_periods
```sql
create table vacation_periods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  start_date date,
  end_date date,
  status text check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table vacation_periods enable row level security;

-- Políticas de segurança
create policy "Usuários podem ver seus próprios períodos"
  on vacation_periods for select
  using (auth.uid() = user_id);

create policy "Administradores podem ver todos os períodos"
  on vacation_periods for select
  using (auth.role() = 'authenticated' and exists (
    select 1 from users where id = auth.uid() and role = 'admin'
  ));
```

## 🚀 Deploy no Vercel

1. Crie uma conta no [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente no painel do Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em "Deploy"

## ✅ Checklist de Testes

Antes do deploy, verifique:

1. **Autenticação**
   - [ ] Login funciona corretamente
   - [ ] Logout funciona corretamente
   - [ ] Redirecionamento após login/logout está correto

2. **Usuários**
   - [ ] Cadastro de novo usuário funciona
   - [ ] Edição de usuário funciona
   - [ ] Permissões de admin/user estão corretas
   - [ ] Validações de formulário funcionam

3. **Férias**
   - [ ] Solicitação de férias funciona
   - [ ] Aprovação/rejeição de férias funciona
   - [ ] Calendário mostra períodos corretamente
   - [ ] Cálculo de dias de férias está correto

4. **Interface**
   - [ ] Layout responsivo funciona
   - [ ] Navegação entre páginas funciona
   - [ ] Mensagens de erro/sucesso aparecem corretamente
   - [ ] Loading states funcionam

5. **Performance**
   - [ ] Build de produção gera sem erros
   - [ ] Aplicação carrega rapidamente
   - [ ] Não há erros no console

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 