

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE evento_status AS ENUM ('draft', 'published', 'cancelled', 'finished');
CREATE TYPE registro_status AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlist');

CREATE TABLE organizador (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contact_phone VARCHAR(30)
);

CREATE TABLE evento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizador_id UUID NOT NULL REFERENCES organizador(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  capacity INTEGER,
  price NUMERIC(10,2) DEFAULT 0.00,
  status evento_status DEFAULT 'draft'
);

CREATE TABLE participante (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30),
  date_of_birth DATE,
  profile JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE registro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
  participante_id UUID NOT NULL REFERENCES participante(id) ON DELETE CASCADE,
  status registro_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_amount NUMERIC(10,2) DEFAULT 0.00,
  UNIQUE (evento_id, participante_id)
);

INSERT INTO organizador (name, email, contact_phone) VALUES
('Eventos Brasil', 'contato@eventosbrasil.com', '11987654321'),
('TechMasters', 'info@techmasters.com', '21999887766'),
('Cultura Viva', 'cultura@vivabrasil.com', '31988776655');

INSERT INTO evento (
  organizador_id, title, description, location, start_at, end_at, capacity, price, status
) VALUES 
(
  (SELECT id FROM organizador WHERE email = 'contato@eventosbrasil.com'),
  'Workshop de Programação',
  'Treinamento intensivo de lógica, APIs e microserviços.',
  'São Paulo - Centro',
  '2025-10-10 09:00:00-03',
  '2025-10-10 17:00:00-03',
  40,
  120.00,
  'published'
),
(
  (SELECT id FROM organizador WHERE email = 'info@techmasters.com'),
  'Tech Conference 2025',
  'Palestras, bate-papos e networking com profissionais de tecnologia.',
  'Rio de Janeiro - Copacabana',
  '2025-11-20 08:00:00-03',
  '2025-11-22 18:00:00-03',
  300,
  350.00,
  'published'
),
(
  (SELECT id FROM organizador WHERE email = 'cultura@vivabrasil.com'),
  'Festival de Música e Arte',
  'Shows ao vivo, exposições culturais e feiras temáticas.',
  'Belo Horizonte - Praça Central',
  '2025-12-05 16:00:00-03',
  '2025-12-07 23:00:00-03',
  500,
  0.00,
  'draft'
);

INSERT INTO participante (full_name, email, phone, date_of_birth, profile) VALUES
(
  'Ana Maria Silva',
  'ana.silva@example.com',
  '11991234567',
  '1995-03-12',
  '{"interests": ["tecnologia", "workshops"], "newsletter": true}'
),
(
  'Lucas Andrade',
  'lucas.andrade@example.com',
  '21999887766',
  '1990-07-22',
  '{"vip": true, "instagram": "@lucasdev"}'
),
(
  'Carla Moura',
  'carla.moura@example.com',
  '31988774455',
  '1988-05-30',
  '{"preferences": {"seat": "front", "food": "vegan"}}'
);

INSERT INTO registro (evento_id, participante_id, status, paid_amount) VALUES
(
  (SELECT id FROM evento WHERE title = 'Workshop de Programação'),
  (SELECT id FROM participante WHERE email = 'ana.silva@example.com'),
  'confirmed',
  120.00
),
(
  (SELECT id FROM evento WHERE title = 'Tech Conference 2025'),
  (SELECT id FROM participante WHERE email = 'lucas.andrade@example.com'),
  'pending',
  0.00
),
(
  (SELECT id FROM evento WHERE title = 'Festival de Música e Arte'),
  (SELECT id FROM participante WHERE email = 'carla.moura@example.com'),
  'confirmed',
  0.00
);


