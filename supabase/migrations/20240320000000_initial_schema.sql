-- Criar tabela de usuários
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text not null check(role in ('admin', 'user')),
  department text,
  position text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de períodos de férias
create table public.vacation_periods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  status text not null check(status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de configurações do sistema
create table public.system_config (
  id integer primary key generated always as identity,
  vacation_days_per_year integer not null default 30,
  min_vacation_days integer not null default 5,
  max_vacation_days integer not null default 30,
  notification_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserir configuração padrão do sistema
insert into public.system_config (vacation_days_per_year, min_vacation_days, max_vacation_days)
values (30, 5, 30);

-- Configurar políticas de segurança
alter table public.users enable row level security;
alter table public.vacation_periods enable row level security;
alter table public.system_config enable row level security;

-- Políticas para usuários
create policy "Usuários podem ver seus próprios dados"
  on public.users for select
  using (auth.uid() = id);

create policy "Admins podem ver todos os usuários"
  on public.users for select
  using (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  ));

-- Políticas para períodos de férias
create policy "Usuários podem ver seus próprios períodos"
  on public.vacation_periods for select
  using (auth.uid() = user_id);

create policy "Admins podem ver todos os períodos"
  on public.vacation_periods for select
  using (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  ));

create policy "Usuários podem criar seus próprios períodos"
  on public.vacation_periods for insert
  with check (auth.uid() = user_id);

create policy "Admins podem atualizar qualquer período"
  on public.vacation_periods for update
  using (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  ));

create policy "Admins podem deletar qualquer período"
  on public.vacation_periods for delete
  using (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  ));

-- Políticas para configurações do sistema
create policy "Todos podem ver configurações do sistema"
  on public.system_config for select
  to authenticated
  using (true);

create policy "Apenas admins podem atualizar configurações"
  on public.system_config for update
  using (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'admin'
  ));

-- Função para atualizar o timestamp de atualização
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger para atualizar o timestamp
create trigger handle_system_config_updated_at
  before update on public.system_config
  for each row
  execute function public.handle_updated_at(); 