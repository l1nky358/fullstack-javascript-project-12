// run-tests.js
const { spawn } = require('child_process');
const http = require('http');

let serverProcess;

function waitForServer(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkServer = () => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/health',
        method: 'GET',
        timeout: 1000
      }, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Server is ready');
          resolve();
        } else {
          retry();
        }
      });
      
      req.on('error', () => retry());
      req.end();
    };
    
    const retry = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Server didn't start within ${timeout}ms`));
      } else {
        setTimeout(checkServer, 1000);
      }
    };
    
    checkServer();
  });
}

async function runTests() {
  console.log('Starting server...');
  
  serverProcess = spawn('node', ['test-server.js'], {
    stdio: 'inherit',
    detached: false
  });
  
  try {
    await waitForServer(5001, 30000);
    
    console.log('Running Playwright tests...');

    const testProcess = spawn('npx', ['playwright', 'test'], {
      stdio: 'inherit',
      shell: true
    });
    
    testProcess.on('exit', (code) => {
      console.log(`Tests finished with code: ${code}`);
      serverProcess.kill();
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    serverProcess.kill();
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  if (serverProcess) serverProcess.kill();
  process.exit(0);
});

runTests();