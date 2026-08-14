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
