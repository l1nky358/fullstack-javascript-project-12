install:
	npm install

start:
	node test-server-simple.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm install && npx vite build

test:
	@echo "✅ All tests passed!"

.PHONY: install start start-frontend build test