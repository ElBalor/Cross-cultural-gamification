// Quick script to check if POSTGRES_URL is set
require('dotenv').config({ path: '.env.local' });

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  console.error('❌ POSTGRES_URL is not set in .env.local');
  console.log('\n📝 Add this to your .env.local file:');
  console.log('POSTGRES_URL=your_connection_string_here\n');
  process.exit(1);
} else {
  // Mask the password in the URL for security
  const maskedUrl = postgresUrl.replace(/:[^:@]+@/, ':****@');
  console.log('✅ POSTGRES_URL is set');
  console.log(`   ${maskedUrl}`);
  console.log('\n💡 Make sure your dev server is restarted after adding this!');
}
