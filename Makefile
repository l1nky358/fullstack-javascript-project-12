.PHONY: install build start test

install:
	npm install --no-audit --no-fund

build:
	echo "Build completed"

start:
	node test-server.js

test:
	node -e "const { spawn } = require('child_process'); const server = spawn('node', ['test-server.js'], { stdio: 'inherit', detached: false }); setTimeout(() => { const tests = spawn('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true }); tests.on('exit', (code) => { server.kill(); process.exit(code); }); }, 3000);"
