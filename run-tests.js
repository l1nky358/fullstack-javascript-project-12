const { spawn } = require('child_process');

console.log('Starting server...');
const server = spawn('node', ['test-server.js'], { 
  stdio: 'inherit',
  detached: false 
});

setTimeout(() => {
  console.log('Running tests...');
  const tests = spawn('npx', ['playwright', 'test', 'example.test.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  tests.on('exit', (code) => {
    server.kill();
    process.exit(code);
  });
}, 5000);
