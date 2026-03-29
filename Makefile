install:
	npm install --no-audit --no-fund

start:
	node test-server.js

build:
	@echo "Build completed"
	@exit 0

test:
	npx playwright test

.PHONY: install start build test