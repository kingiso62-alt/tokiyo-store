const { Client } = require('pg');
const client = new Client('postgresql://postgres.bxnshuajanvzbnvuqvfk:tokiyostore1@aws-0-eu-west-1.pooler.supabase.com:5432/postgres');
client.connect().then(() => {
  return client.query("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'orders'::regclass;");
}).then(res => {
  console.log(res.rows);
  client.end();
}).catch(console.error);
