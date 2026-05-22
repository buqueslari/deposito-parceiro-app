-- ============================================================
-- Depósito Parceiro — Schema completo
-- Cole no Supabase → SQL Editor → Run
-- ============================================================

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT,
  status         TEXT NOT NULL DEFAULT 'aguardando_pagamento',
  paid           BOOLEAN NOT NULL DEFAULT FALSE,
  total          NUMERIC(10, 2),
  total_cents    INTEGER,
  customer       JSONB,
  address        JSONB,
  notes          TEXT,
  items          JSONB,
  payment        JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx     ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx         ON orders (status);
CREATE INDEX IF NOT EXISTS orders_transaction_id_idx ON orders (transaction_id);

-- Tabela de eventos de funil (tracking)
CREATE TABLE IF NOT EXISTS events (
  id         BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  event      TEXT NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_session_id_idx ON events (session_id);
CREATE INDEX IF NOT EXISTS events_event_idx      ON events (event);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at DESC);

-- Tabela de configurações da loja
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Configurações padrão
INSERT INTO settings (key, value) VALUES
  ('store_name',       'Depósito Parceiro'),
  ('store_phone',      '(11) 3026-6912'),
  ('store_whatsapp',   '5511930266912'),
  ('store_city',       'São Paulo · SP'),
  ('store_hours',      'Diariamente · Aberto 24 horas'),
  ('store_cnpj',       '01.875.479/0001-72'),
  ('delivery_min',     '40'),
  ('delivery_fee',     '0'),
  ('delivery_eta_min', '20'),
  ('delivery_eta_max', '35'),
  ('coupon_enabled',   'true'),
  ('coupon_value',     '15'),
  ('coupon_min_order', '50')
ON CONFLICT (key) DO NOTHING;

-- Trigger updated_at em orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS settings_updated_at ON settings;
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Anon pode inserir pedidos e eventos (frontend)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='anon insert') THEN
    CREATE POLICY "anon insert" ON orders FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='events' AND policyname='anon insert') THEN
    CREATE POLICY "anon insert" ON events FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;
-- Service role bypassa RLS automaticamente (server.js lê/atualiza tudo)
