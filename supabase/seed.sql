-- Inserir usuário admin
insert into auth.users (email, encrypted_password, email_confirmed_at)
values ('admin@empresa.com', crypt('admin123', gen_salt('bf')), now())
returning id into admin_id;

insert into public.users (id, email, name, role, department, position)
values (admin_id, 'admin@empresa.com', 'João Silva', 'admin', 'TI', 'Gerente de TI');

-- Inserir usuário comum
insert into auth.users (email, encrypted_password, email_confirmed_at)
values ('usuario@empresa.com', crypt('admin123', gen_salt('bf')), now())
returning id into user_id;

insert into public.users (id, email, name, role, department, position)
values (user_id, 'usuario@empresa.com', 'Maria Santos', 'user', 'RH', 'Analista de RH');

-- Inserir mais alguns usuários de exemplo
insert into auth.users (email, encrypted_password, email_confirmed_at)
values 
('pedro@empresa.com', crypt('admin123', gen_salt('bf')), now()),
('ana@empresa.com', crypt('admin123', gen_salt('bf')), now()),
('carlos@empresa.com', crypt('admin123', gen_salt('bf')), now())
returning id into user_ids;

insert into public.users (id, email, name, role, department, position)
values 
(user_ids[1], 'pedro@empresa.com', 'Pedro Oliveira', 'user', 'Vendas', 'Vendedor'),
(user_ids[2], 'ana@empresa.com', 'Ana Costa', 'user', 'Marketing', 'Analista de Marketing'),
(user_ids[3], 'carlos@empresa.com', 'Carlos Souza', 'user', 'Financeiro', 'Contador'); 