install:
	npm ci

start:
	node test-server.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm ci && npm run build

test:
	npx playwright test

test-debug:
	npx playwright test --debug

.PHONY: install start start-frontend build test test-debug