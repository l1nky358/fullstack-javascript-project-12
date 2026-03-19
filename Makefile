install:
	npm install

start:
	node test-server.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm install && npm run build

test:
	npx playwright test

.PHONY: install start start-frontend build test
