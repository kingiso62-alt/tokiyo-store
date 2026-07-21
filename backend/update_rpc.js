const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const connectionString = 'postgresql://postgres.bxnshuajanvzbnvuqvfk:tokiyostore1@aws-0-eu-west-1.pooler.supabase.com:5432/postgres';
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to database...");

    const sqlPath = path.join(__dirname, '..', 'order_workflow.sql');
    const lines = fs.readFileSync(sqlPath, 'utf8').split('\n');
    
    // Find start and end of create_order function
    const startIndex = lines.findIndex(line => line.includes('CREATE OR REPLACE FUNCTION create_order('));
    
    // Find the end $$; after the startIndex
    let endIndex = -1;
    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].trim() === '$$;') {
        endIndex = i;
        break;
      }
    }

    if (startIndex !== -1 && endIndex !== -1) {
      const functionSql = lines.slice(startIndex, endIndex + 1).join('\n');
      console.log("Found function length:", functionSql.length);
      await client.query(functionSql);
      console.log("create_order RPC updated successfully!");
    } else {
      console.error("Could not find function bounds in order_workflow.sql");
    }

  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
}

run();
