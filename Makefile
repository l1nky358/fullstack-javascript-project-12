install:
	npm install

start:
	node test-server.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm install && chmod +x node_modules/.bin/vite && ./node_modules/.bin/vite build

test:
	npx playwright test

test-debug:
	npx playwright test --debug

.PHONY: install start start-frontend build test test-debug