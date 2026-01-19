const http = require('http');

const checkEndpoint = (path) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3001${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (e) => {
      resolve({ error: e.message });
    });
  });
};

async function runTests() {
  console.log('🧪 Starting System Verification...\n');
  
  // 1. Check Database Connection
  console.log('1. Checking Database Connection...');
  const dbResult = await checkEndpoint('/api/test-db');
  if (dbResult.error) {
    console.log('❌ Server not reachable. Is it running?');
  } else if (dbResult.status === 200 && dbResult.data.success) {
    console.log('✅ Database connection successful!');
  } else {
    console.log('❌ Database check failed:', dbResult.data);
  }

  // 2. Check ML/Analysis Endpoint (Health check)
  console.log('\n2. Checking ML Service...');
  // Note: This is just a connectivity check
  const mlResult = await checkEndpoint('/api/test-ml');
   if (mlResult.error) {
    console.log('❌ Server not reachable.');
  } else if (mlResult.status === 200) {
    console.log('✅ ML Service responding!');
  } else {
    console.log('⚠️ ML Service returned:', mlResult.status);
  }

  console.log('\n----------------------------------------');
  console.log('To manually test the database, you can also visit:');
  console.log('http://localhost:3000/api/test-db');
}

// Wait a bit for server to start
setTimeout(runTests, 5000);
