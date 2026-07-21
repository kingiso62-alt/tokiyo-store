const { Client } = require('pg');

async function run() {
  const connectionString = 'postgresql://postgres.bxnshuajanvzbnvuqvfk:tokiyostore1@aws-0-eu-west-1.pooler.supabase.com:5432/postgres';
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to database...");

    const migrationSql = `
      -- 1. Expenses Table
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        expense_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Security Bans Table
      CREATE TABLE IF NOT EXISTS security_bans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ip_address TEXT,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        reason TEXT,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 3. Settings Table (For Maintenance Mode etc)
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        key TEXT UNIQUE NOT NULL,
        value JSONB NOT NULL,
        description TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Insert default settings
      INSERT INTO settings (key, value, description)
      VALUES 
        ('maintenance_mode', 'false'::jsonb, 'Toggle website maintenance mode ON or OFF')
      ON CONFLICT (key) DO NOTHING;
    `;

    await client.query(migrationSql);
    console.log("Migration applied successfully!");

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

run();
