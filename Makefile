install:
	npm ci

start:
	npx nodemon test-server.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm ci && npm run build

test:
	npx playwright test

test-local:
	npx playwright test --headed

.PHONY: install start start-frontend build test test-local
