CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  empresa TEXT DEFAULT '',
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  promos INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado_en TEXT,
  origen TEXT DEFAULT '',
  ip_hash TEXT DEFAULT '',
  user_agent TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_clientes_whatsapp ON clientes(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clientes_promos ON clientes(promos);
CREATE INDEX IF NOT EXISTS idx_clientes_creado_en ON clientes(creado_en);

CREATE TABLE IF NOT EXISTS consultas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  servicio TEXT NOT NULL,
  archivo TEXT DEFAULT '',
  detalle TEXT DEFAULT '',
  origen TEXT DEFAULT '',
  campana TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'nuevo',
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_consultas_email ON consultas(email);
CREATE INDEX IF NOT EXISTS idx_consultas_estado ON consultas(estado);
CREATE INDEX IF NOT EXISTS idx_consultas_creado ON consultas(creado_en);
