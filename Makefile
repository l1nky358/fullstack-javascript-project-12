install:
	npm install

start:
	node test-server-simple.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm install && chmod +x node_modules/.bin/vite && ./node_modules/.bin/vite build

test:
	npx playwright test

.PHONY: install start start-frontend build test