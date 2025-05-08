-- Inserir usuário admin
INSERT OR IGNORE INTO users (email, password, name, role, department, position)
VALUES ('admin@empresa.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'João Silva', 'admin', 'TI', 'Gerente de TI');

-- Inserir usuário comum
INSERT OR IGNORE INTO users (email, password, name, role, department, position)
VALUES ('usuario@empresa.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'Maria Santos', 'user', 'RH', 'Analista de RH');

-- Inserir mais alguns usuários de exemplo
INSERT OR IGNORE INTO users (email, password, name, role, department, position)
VALUES 
('pedro@empresa.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'Pedro Oliveira', 'user', 'Vendas', 'Vendedor'),
('ana@empresa.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'Ana Costa', 'user', 'Marketing', 'Analista de Marketing'),
('carlos@empresa.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'Carlos Souza', 'user', 'Financeiro', 'Contador'); 