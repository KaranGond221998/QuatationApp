-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. System Types Table
CREATE TABLE IF NOT EXISTS system_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  default_terms TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  customer_email TEXT,
  quote_date DATE DEFAULT CURRENT_DATE,
  system_type_id UUID REFERENCES system_types(id),
  capacity_kw DECIMAL(10,2),
  phase INTEGER DEFAULT 1,
  brand TEXT,
  base_price DECIMAL(12,2),
  gst_rate DECIMAL(5,2) DEFAULT 8.9,
  gst_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2),
  central_subsidy DECIMAL(12,2),
  state_subsidy DECIMAL(12,2),
  terms JSONB,
  components JSONB,
  savings_data JSONB,
  form_data JSONB,
  salesperson TEXT,
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Components Table
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_type_id UUID REFERENCES system_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_quantity TEXT DEFAULT '1 Nos',
  default_make TEXT DEFAULT 'Standard',
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table (for catalog & price lookups)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_type_id UUID REFERENCES system_types(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  capacity_kw DECIMAL(10,2),
  phase INTEGER DEFAULT 1,
  base_price DECIMAL(12,2) NOT NULL,
  gst_rate DECIMAL(5,2) DEFAULT 8.9,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Structure Catalog Table (Apollo & mounting structures)
CREATE TABLE IF NOT EXISTS structure_catalog (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT DEFAULT 'G.I. Solar Mounting Structure',
  unit TEXT DEFAULT 'Pcs',
  gst_rate DECIMAL(5,2) DEFAULT 18,
  base_price DECIMAL(12,2) DEFAULT 0,
  stock TEXT DEFAULT 'In Stock',
  description TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Internal Quotes Table (for quick quote logs)
CREATE TABLE IF NOT EXISTS internal_quotes (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  salesperson_name TEXT,
  location TEXT,
  kwp DECIMAL(10,2),
  phase INTEGER,
  module_watt INTEGER,
  qty INTEGER,
  base_price DECIMAL(12,2),
  extra_margin DECIMAL(12,2),
  wire_price DECIMAL(12,2),
  height_price DECIMAL(12,2),
  out_of_vns_price DECIMAL(12,2),
  subtotal DECIMAL(12,2),
  gst_amount DECIMAL(12,2),
  total DECIMAL(12,2),
  discount DECIMAL(12,2),
  grand_total DECIMAL(12,2),
  channel TEXT DEFAULT 'whatsapp',
  tax_rate DECIMAL(5,3) DEFAULT 0.089,
  currency TEXT DEFAULT 'INR',
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Integrated Products Table
CREATE TABLE IF NOT EXISTS integrated_products (
  id BIGSERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  system_kw DECIMAL(10,2) NOT NULL,
  phase TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  inverter_capacity_kw DECIMAL(10,2) NOT NULL,
  module_watt INTEGER NOT NULL,
  module_type TEXT,
  no_of_modules INTEGER NOT NULL,
  acdb_nos INTEGER DEFAULT 1,
  dcdb_nos INTEGER DEFAULT 1,
  earthing_rod_nos INTEGER DEFAULT 3,
  earthing_chemical_nos INTEGER DEFAULT 3,
  ac_wire_brand TEXT,
  ac_wire_length_mtr INTEGER DEFAULT 10,
  dc_wire_brand TEXT,
  dc_wire_length_mtr INTEGER DEFAULT 20,
  earthing_wire_brand TEXT,
  earthing_wire_length_mtr INTEGER DEFAULT 90,
  lighting_arrestor_qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default System Types Seed
INSERT INTO system_types (name, description)
SELECT 'On-grid', 'Grid Connected System'
WHERE NOT EXISTS (SELECT 1 FROM system_types WHERE name = 'On-grid');

INSERT INTO system_types (name, description)
SELECT 'Off-grid', 'Battery Based System'
WHERE NOT EXISTS (SELECT 1 FROM system_types WHERE name = 'Off-grid');

INSERT INTO system_types (name, description)
SELECT 'Hybrid', 'Hybrid System'
WHERE NOT EXISTS (SELECT 1 FROM system_types WHERE name = 'Hybrid');

INSERT INTO system_types (name, description)
SELECT 'VFD/Drive', 'Solar Pump Drive'
WHERE NOT EXISTS (SELECT 1 FROM system_types WHERE name = 'VFD/Drive');
