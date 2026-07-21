const { Client } = require('pg');
const client = new Client('postgresql://postgres.bxnshuajanvzbnvuqvfk:tokiyostore1@aws-0-eu-west-1.pooler.supabase.com:5432/postgres');
client.connect().then(() => {
  return client.query("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status';");
}).then(res => {
  console.log(res.rows);
  return client.query("SELECT enum_range(NULL::order_status);").catch(() => null);
}).then(res => {
  if (res) console.log("Enum values:", res.rows);
  client.end();
}).catch(console.error);
