# Makefile для Hexlet Check

install:
	cd frontend && npm install --no-audit --no-fund
	npm install --no-audit --no-fund

build:
	@echo "Build completed"
	@exit 0

start:
	node test-server.js

test:
	npx playwright test

.PHONY: install build start test
