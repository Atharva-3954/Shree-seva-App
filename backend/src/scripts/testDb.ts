import 'dotenv/config';
import { testConnection } from '../config/database';

async function main() {
  console.log('Testing Neon PostgreSQL database connection...');
  const success = await testConnection();
  if (success) {
    console.log('Database connection verified successfully.');
    process.exit(0);
  } else {
    console.error('Could not connect to database. Please check your DATABASE_URL in .env');
    process.exit(1);
  }
}

main();

